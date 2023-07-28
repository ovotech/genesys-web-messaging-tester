import { ClientOptions, RawData, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Response } from './Response';
import { SessionResponse } from './SessionResponse';
import { StructuredMessage } from './StructuredMessage';
import { EventEmitter } from 'events';
import debug from 'debug';
import { ClientRequestArgs } from 'http';
import { MessageDelayer, ReorderedMessageDelayer } from './message-delayer/MessageDelayer';

export interface WebMessengerSession extends EventEmitter {
  sendText(message: string): void;

  close(): void;
}

export interface SessionConfig {
  readonly deploymentId: string;
  readonly region: string;
  readonly origin?: string | undefined;
}

function isSessionResponse(message: Response<unknown>): message is SessionResponse {
  return message.type === 'response' && message.class === 'SessionResponse';
}

export function isStructuredMessage(message: Response<unknown>): message is StructuredMessage {
  return message.type === 'message' && message.class === 'StructuredMessage';
}

/**
 * @see https://developer.genesys.cloud/api/digital/webmessaging/websocketapi#configure-a-guest-session
 */
export class WebMessengerGuestSession extends EventEmitter {
  private static readonly debugger = debug('WebMessengerGuestSession');

  private readonly sessionToken: string;
  private readonly ws: WebSocket;

  constructor(
    private readonly config: SessionConfig,
    private readonly participantData: Record<string, string> = {},
    readonly wsFactory = (url: string, options?: ClientOptions | ClientRequestArgs) =>
      new WebSocket(url, options),
    private readonly messageDelayer: MessageDelayer = new ReorderedMessageDelayer(),
  ) {
    super();
    this.sessionToken = uuidv4();

    const url = `wss://webmessaging.${this.config.region}/v1?deploymentId=${this.config.deploymentId}`;
    WebMessengerGuestSession.debugger('Connecting to: %s', url);

    this.ws = wsFactory(url, { origin: this.config.origin });
    this.ws.on('open', () => this.connected());
    this.ws.on('message', (data) => this.messageReceived(data));

    messageDelayer.on('message', (message) => this.processMessage(message));
  }

  private connected(): void {
    // https://developer.genesys.cloud/api/digital/webmessaging/websocketapi#configure-a-guest-session
    const payload = {
      action: 'configureSession',
      deploymentId: this.config.deploymentId,
      token: this.sessionToken,
    };

    WebMessengerGuestSession.debugger('Sending: %O', payload);
    this.ws.send(JSON.stringify(payload));
  }

  private processMessage(message: Response<unknown>): void {
    if (isSessionResponse(message)) {
      this.emit('sessionStarted', message);
      return;
    }

    if (isStructuredMessage(message)) {
      this.emit('structuredMessage', message);
      return;
    }

    console.log('Unknown message', message);
  }

  private messageReceived(data: RawData): void {
    if (!Buffer.isBuffer(data)) {
      throw new Error('Expected data as Buffer type');
    }

    const textPayload = data.toString('utf-8');
    WebMessengerGuestSession.debugger('Received: %O', textPayload);

    const payload = JSON.parse(textPayload);
    if (typeof payload.type !== 'string') {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unexpected payload: ${payload}`);
    }

    const message = payload as Response<unknown>;

    if (message.code !== 200) {
      throw Error(`Session Response was ${message.code} instead of 200 due to '${message.body}'`);
    }

    this.messageDelayer.add(message);
  }

  public sendText(message: string): void {
    const payload = {
      action: 'onMessage',
      token: this.sessionToken,
      message: {
        type: 'Text',
        text: message,
      },
      ...(Object.keys(this.participantData).length === 0
        ? {}
        : {
            channel: {
              metadata: {
                customAttributes: this.participantData ?? {},
              },
            },
          }),
    };

    WebMessengerGuestSession.debugger('Sending: %O', payload);
    this.ws.send(JSON.stringify(payload));
  }

  public close(): void {
    this.ws.close();
  }
}
