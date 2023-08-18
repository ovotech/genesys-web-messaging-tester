import WebSocket, { WebSocketServer } from 'ws';
import { WebMessageServerConnectionFixture } from './WebMessageServerConnectionFixture';

export class WebMessageServerFixture {
  private wss: WebSocketServer;
  private connections: WebSocket[];

  constructor(public readonly port: number) {
    this.wss = new WebSocketServer({ port });

    this.connections = [];
    this.wss.on('connection', (ws) => {
      this.connections.push(ws);
    });
  }

  public async waitForConnection(): Promise<WebMessageServerConnectionFixture> {
    return new Promise((resolve) => {
      this.wss.on('connection', (ws) => resolve(new WebMessageServerConnectionFixture(ws)));
    });
  }

  public close(): void {
    this.connections.forEach((c) => c.close());
    this.wss.close();
  }
}
