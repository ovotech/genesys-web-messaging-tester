import {RawData, WebSocket} from 'ws';
import {v4 as uuidv4} from 'uuid';
import {Response} from './Response';
import {SessionResponse} from './SessionResponse';
import {StructuredMessage} from './StructuredMessage';
import {EventEmitter} from 'events';

export class GenesysMessengerSession extends EventEmitter {
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

    this.ws = wsFactory(`wss://webmessaging.${region}/v1?deploymentId=${this.deploymentId}`);
    this.ws.on('open', this.processOpenRef);
    this.ws.on('message', this.processMessageRef);
  }

  private processOpen(): void {
    this.ws.send(
      // https://developer.genesys.cloud/api/digital/webmessaging/websocketapi#configure-a-guest-session
      JSON.stringify({
        action: 'configureSession',
        deploymentId: this.deploymentId,
        token: this.sessionToken,
      }),
    );
  }

  private processMessage(data: RawData): void {
    // console.log('received: %s', data);
    if (!Buffer.isBuffer(data)) {
      throw new Error('Expected data as Buffer type');
    }

    const payload = JSON.parse(data.toString('utf-8'));
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
          // console.log('SessionResponse', sessionResponse);

          this.emit('sessionStarted', sessionResponse);
        }
        break;
      case 'message':
        if (message.class === 'StructuredMessage') {
          const structuredMessage = message as StructuredMessage;
          // console.log('StructuredMessage', structuredMessage);

          this.emit('structuredMessage', structuredMessage);
        }
        break;
      default:
        console.log('Unknown message', message);
    }
  }

  public sendText(message: string): void {
    this.ws.send(
      JSON.stringify({
        action: 'onMessage',
        token: this.sessionToken,
        message: {
          type: 'Text',
          text: message,
        },
      }),
    );
  }

  public close() {
    this.ws.close();
  }
}
