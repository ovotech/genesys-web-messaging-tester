import { RawData, WebSocket, ClientOptions } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Response } from './Response';
import { SessionResponse } from './SessionResponse';
import { StructuredMessage } from './StructuredMessage';
import { EventEmitter } from 'events';
import debug from 'debug';
import { ClientRequestArgs } from 'http';

export interface WebMessengerSession extends EventEmitter {
  sendText(message: string): void;

  close(): void;
}

export interface SessionConfig {
  readonly deploymentId: string;
  readonly region: string;
  readonly origin?: string | undefined;
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
  ) {
    super();
    this.sessionToken = uuidv4();

    const url = `wss://webmessaging.${this.config.region}/v1?deploymentId=${this.config.deploymentId}`;
    WebMessengerGuestSession.debugger('Connecting to: %s', url);

    this.ws = wsFactory(url, { origin: this.config.origin });
    this.ws.on('open', () => this.connected());
    this.ws.on('message', (data) => this.messageReceived(data));
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

  private messageReceived(data: RawData): void {
    if (!Buffer.isBuffer(data)) {
      throw new Error('Expected data as Buffer type');
    }

    const textPayload = data.toString('utf-8');
    WebMessengerGuestSession.debugger('Received: %O', textPayload);

    const payload = JSON.parse(textPayload);
    if (typeof payload.type !== 'string') {
      throw new Error(`Unexpected payload: ${payload}`);
    }

    const message = payload as Response<any>;

    if (message.code !== 200) {
      throw Error(`Session Response was ${payload.code} instead of 200 due to '${payload.body}'`);
    }

    switch (message.type) {
      case 'response':
        if (message.class === 'SessionResponse') {
          const sessionResponse = message as SessionResponse;
          this.emit('sessionStarted', sessionResponse);
        }
        break;
      case 'message':
        if (message.class === 'StructuredMessage') {
          const structuredMessage = message as StructuredMessage;
          this.emit('structuredMessage', structuredMessage);
        }
        break;
      default:
        console.log('Unknown message', message);
    }
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

  public close() {
    this.ws.close();
  }
}
