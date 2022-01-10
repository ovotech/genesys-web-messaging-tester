import { RawData, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Response } from './Response';
import { SessionResponse } from './SessionResponse';
import { StructuredMessage } from './StructuredMessage';
import { EventEmitter } from 'events';
import debug from 'debug';

export class GenesysMessengerSession extends EventEmitter {
  private static debugger = debug('GenesysMessengerSession');

  private readonly sessionToken: string;
  private readonly ws: WebSocket;
  private readonly processMessageRef: (data: RawData) => void;
  private readonly processOpenRef: () => void;

  constructor(
    private readonly deploymentId: string,
    readonly region: string,
    readonly wsFactory = (url: string) => new WebSocket(url),
  ) {
    super();
    this.sessionToken = uuidv4();

    this.processMessageRef = this.processMessage.bind(this);
    this.processOpenRef = this.processOpen.bind(this);

    const url = `wss://webmessaging.${region}/v1?deploymentId=${this.deploymentId}`;
    GenesysMessengerSession.debugger('Connecting to: %s', url);

    this.ws = wsFactory(url);
    this.ws.on('open', this.processOpenRef);
    this.ws.on('message', this.processMessageRef);
  }

  private processOpen(): void {
    // https://developer.genesys.cloud/api/digital/webmessaging/websocketapi#configure-a-guest-session
    const payload = {
      action: 'configureSession',
      deploymentId: this.deploymentId,
      token: this.sessionToken,
    };

    GenesysMessengerSession.debugger('Sending: %O', payload);
    this.ws.send(JSON.stringify(payload));
  }

  private processMessage(data: RawData): void {
    if (!Buffer.isBuffer(data)) {
      throw new Error('Expected data as Buffer type');
    }

    const textPayload = data.toString('utf-8');
    GenesysMessengerSession.debugger('Received: %O', textPayload);

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
    };

    GenesysMessengerSession.debugger('Sending: %O', payload);
    this.ws.send(JSON.stringify(payload));
  }

  public close() {
    this.ws.close();
  }
}
