import { GenesysMessengerSession } from './genesys/GenesysMessengerSession';
import { StructuredMessage } from './genesys/StructuredMessage';

/**
 * Provides an API to make interacting in a back-and-forth style conversation
 * easy to test.
 *
 * @example
 * const convo = new Conversation(
 *   new GenesysMessengerSession('deployment-id-123', 'region-123.pure.cloud'),
 * );
 *
 * await convo.waitForSessionToStart();
 * convo.sendText('hi');
 *
 * const reply = await convo.waitForResponse();
 * console.log(reply);
 */
export class Conversation {
  constructor(private readonly messengerSession: GenesysMessengerSession) {}

  public async waitForSessionToStart(): Promise<void> {
    return new Promise((resolve) => {
      this.messengerSession.on('sessionStarted', resolve);
    });
  }

  public sendText(text: string): void {
    this.messengerSession.sendText(text);
  }

  public async waitForResponse(): Promise<string> {
    return new Promise((resolve) => {
      this.messengerSession.on('structuredMessage', (event: StructuredMessage) => {
        if (event.body.direction === 'Outbound') {
          resolve(event.body.text);
        }
      });
    });
  }
}
