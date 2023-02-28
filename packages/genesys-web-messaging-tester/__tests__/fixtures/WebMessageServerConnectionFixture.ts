import WebSocket from 'ws';
import {
  webMessagePayloads,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
} from './webMessagePayloads';

export class WebMessageServerConnectionFixture {
  constructor(private readonly ws: WebSocket) {}

  public async waitForMessage(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ws.on('message', function message(data) {
        if (!Buffer.isBuffer(data)) {
          reject(new Error('Expected data as Buffer type'));
        }

        try {
          resolve(JSON.parse(data.toString('utf-8')));
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  public simulateSessionResponseMessage(): void {
    const payload = webMessagePayloads.sessionResponse();
    this.ws.send(JSON.stringify(payload));
  }

  public simulateOutboundTextStructuredMessage(text: string, date: Date = new Date()): void {
    const payload = webMessagePayloads.outboundTextStructuredMessage(text, date);
    this.ws.send(JSON.stringify(payload));
  }

  public simulateOutboundDisconnectEventStructuredMessage(date: Date = new Date()): void {
    const payload = webMessagePayloads.outboundDisconnectEventStructuredMessage(date);
    this.ws.send(JSON.stringify(payload));
  }

  public simulateInboundTextStructuredMessage(text: string, date: Date = new Date()): void {
    const payload = webMessagePayloads.inboundStructuredMessage(text, date);
    this.ws.send(JSON.stringify(payload));
  }
}
