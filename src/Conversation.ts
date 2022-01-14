import { GenesysMessengerSession } from './genesys/GenesysMessengerSession';
import { StructuredMessage } from './genesys/StructuredMessage';

/**
 * Provides an API to make interacting in a back-and-forth style conversation
 * easy to test.
 *
 * @example
 * const convo = new Conversation(
 *   new GenesysMessengerSession({
 *     deploymentId: 'deployment-id-123',
 *     region:'region-123.pure.cloud'
 *   }),
 * );
 *
 * await convo.waitForSessionToStart();
 * convo.sendText('hi');
 *
 * const reply = await convo.waitForResponse();
 * console.log(reply);
 */
export class Conversation {
  private sessionStarted: boolean;

  constructor(private readonly messengerSession: GenesysMessengerSession) {
    this.sessionStarted = false;
    this.messengerSession.once('sessionStarted', () => (this.sessionStarted = true));
  }

  public async waitForConversationToStart(): Promise<void> {
    if (this.sessionStarted) {
      return;
    }

    return new Promise((resolve) => {
      this.messengerSession.once('sessionStarted', () => resolve());
    });
  }

  public sendText(text: string): void {
    this.messengerSession.sendText(text);
  }

  public async waitForResponse(): Promise<string> {
    return new Promise((resolve) => {
      this.messengerSession.once('structuredMessage', (event: StructuredMessage) => {
        if (event.body.direction === 'Outbound') {
          resolve(event.body.text);
        }
      });
    });
  }

  private static createFailureMessage(
    expectedText: string,
    messagesReceived: StructuredMessage[],
  ): string {
    if (messagesReceived.length === 0) {
      return `Timed out waiting for a message that contained '${expectedText}'.
No messages were received.`;
    } else {
      return `Timed out waiting for a message that contained '${expectedText}'
Received:
  ${messagesReceived.map((m) => ` - ${m.body.text}`).join('\n')}`;
    }
  }

  /**
   * Waits until a response containing the text is received. If a response
   * that contains the text isn't received without the timeout period then
   * an exception is thrown.
   *
   * Case-insensitive by default.
   */
  public async waitForResponseContaining(
    text: string,
    {
      timeoutInSeconds = 10,
      caseInsensitive = true,
    }: { timeoutInSeconds?: number; caseInsensitive?: boolean } = {},
  ): Promise<string> {
    const timeoutInMs = timeoutInSeconds * 1000;
    const messagesReceived: StructuredMessage[] = [];

    return new Promise<string>((resolve, reject) => {
      let timeout: NodeJS.Timeout | undefined = undefined;

      const checkMessage = (event: StructuredMessage): void => {
        if (event.body.direction === 'Outbound') {
          messagesReceived.push(event);

          const message = caseInsensitive ? event.body.text.toLocaleLowerCase() : event.body.text;
          const expectedText = caseInsensitive ? text.toLocaleLowerCase() : text;

          if (message.includes(expectedText)) {
            this.messengerSession.off('structuredMessage', checkMessage);

            if (timeout) {
              clearTimeout(timeout);
            }
            resolve(event.body.text);
          }
        }
      };

      this.messengerSession.on('structuredMessage', checkMessage);

      timeout = setTimeout(() => {
        this.messengerSession.off('structuredMessage', checkMessage);

        reject(new Error(Conversation.createFailureMessage(text, messagesReceived)));
      }, timeoutInMs);
    });
  }
}
