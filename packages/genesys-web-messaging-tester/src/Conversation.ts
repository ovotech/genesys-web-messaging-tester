import { WebMessengerSession } from './genesys/WebMessengerGuestSession';
import { StructuredMessage } from './genesys/StructuredMessage';

export class TimeoutWaitingForResponseError extends Error {
  constructor(
    private readonly _expectedResponse: string,
    private readonly _responsesReceived: ReadonlyArray<StructuredMessage> = [],
  ) {
    super(TimeoutWaitingForResponseError.createFailureMessage(_expectedResponse, _responsesReceived));

    Object.setPrototypeOf(this, TimeoutWaitingForResponseError.prototype);
  }

  private static createFailureMessage(
    expectedResponse: string,
    responsesReceived: ReadonlyArray<StructuredMessage>,
  ): string {
    if (responsesReceived.length === 0) {
      return `Timed out waiting for a message that contained '${expectedResponse}'.
No messages were received.`;
    } else {
      return `Timed out waiting for a message that contained '${expectedResponse}'
Received:
  ${responsesReceived.map((m) => ` - ${m.body.text}`).join('\n')}`;
    }
  }

  public get expectedResponse() {
    return this._expectedResponse;
  }

  public get responsesReceived() {
    return this._responsesReceived;
  }
}

/**
 * Provides an API to simplify sending and receiving messages in a Web Messenger
 * session.
 *
 * ```typescript
 * const convo = new Conversation(
 *   new WebMessengerGuestSession({
 *     deploymentId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
 *     region: 'xxxx.pure.cloud',
 *   }),
 * );
 *
 * await convo.waitForConversationToStart();
 * convo.sendText('hi');
 *
 * await convo.waitForResponseContaining('Is this an example?');
 *
 * convo.sendText('yes');
 *
 * const reply = await convo.waitForResponse();
 * console.log(reply);
 * ```
 */
export class Conversation {
  private sessionStarted: boolean;

  constructor(private readonly messengerSession: WebMessengerSession) {
    this.sessionStarted = false;
    this.messengerSession.once('sessionStarted', () => (this.sessionStarted = true));
  }

  /**
   * Resolves when the conversation has started.
   *
   * Starting a conversation is an automatic process that happens in the
   * background. This method allows you to wait for this process to finish.
   */
  public async waitForConversationToStart(): Promise<Conversation> {
    if (this.sessionStarted) {
      return this;
    }

    return new Promise((resolve) => {
      this.messengerSession.once('sessionStarted', () => {
        this.sessionStarted = true;
        resolve(this);
      });
    });
  }

  /**
   * Sends text to the conversation
   * @param text Text containing at least one character
   */
  public sendText(text: string): void {
    if (text.length === 0) {
      throw new Error('Text cannot be empty');
    }

    this.messengerSession.sendText(text);
  }

  /**
   * Resolves on the next response from the other participant in the conversation.
   *
   * If you want to wait for a specific message use {@link waitForResponseContaining}.
   */
  public async waitForResponse(): Promise<string> {
    return new Promise((resolve) => {
      this.messengerSession.on('structuredMessage', (event: StructuredMessage) => {
        if (event.body.direction === 'Outbound') {
          resolve(event.body.text);
        }
      });
    });
  }

  /**
   * Resolves when a response is received that contains a specific piece of text.
   * If a response that contains the text isn't received within the timeout period then
   * an exception is thrown.
   *
   * Case-insensitive by default.
   *
   * If you want to wait for the next response, regardless of what it contains
   * use {@link waitForResponse}.
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

        reject(new TimeoutWaitingForResponseError(text, messagesReceived));
      }, timeoutInMs);
    });
  }
}
