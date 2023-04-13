import { WebMessengerSession } from './genesys/WebMessengerGuestSession';
import {
  StructuredMessage,
  StructuredMessageEventBody,
  StructuredMessageStructuredBody,
  StructuredMessageTextBody,
} from './genesys/StructuredMessage';

export class TimeoutWaitingForResponseError extends Error {
  constructor(
    private readonly _timeoutInMs: number,
    private readonly _expectedResponse: string,
    private readonly _responsesReceived: ReadonlyArray<
      StructuredMessageTextBody | StructuredMessageStructuredBody
    > = [],
  ) {
    super(
      TimeoutWaitingForResponseError.createFailureMessage(
        _timeoutInMs,
        _expectedResponse,
        _responsesReceived,
      ),
    );

    Object.setPrototypeOf(this, TimeoutWaitingForResponseError.prototype);
  }

  private static createFailureMessage(
    timeoutInMs: number,
    expectedResponse: string,
    responsesReceived: ReadonlyArray<StructuredMessageTextBody | StructuredMessageStructuredBody>,
  ): string {
    if (responsesReceived.length === 0) {
      return `Timed-out after ${timeoutInMs}ms waiting for a message that contained '${expectedResponse}'.
No messages were received.`;
    } else {
      return `Timed-out after ${timeoutInMs}ms waiting for a message that contained '${expectedResponse}'
Received:
  ${responsesReceived.map((m) => ` - ${m.text}`).join('\n')}`;
    }
  }

  public get expectedResponse(): string {
    return this._expectedResponse;
  }

  public get responsesReceived(): ReadonlyArray<
    StructuredMessageTextBody | StructuredMessageStructuredBody
  > {
    return this._responsesReceived;
  }

  public get timeoutInMs(): number {
    return this._timeoutInMs;
  }
}

export class BotDisconnectedWaitingForResponseError extends Error {
  constructor(
    private readonly _expectedResponse: string,
    private readonly _responsesReceived: ReadonlyArray<
      StructuredMessageTextBody | StructuredMessageStructuredBody
    > = [],
  ) {
    super(
      BotDisconnectedWaitingForResponseError.createFailureMessage(
        _expectedResponse,
        _responsesReceived,
      ),
    );

    Object.setPrototypeOf(this, BotDisconnectedWaitingForResponseError.prototype);
  }

  private static createFailureMessage(
    expectedResponse: string,
    responsesReceived: ReadonlyArray<StructuredMessageTextBody | StructuredMessageStructuredBody>,
  ): string {
    if (responsesReceived.length === 0) {
      return `Bot disconnected from the conversation whilst waiting a message that contained '${expectedResponse}'.
No messages were received before disconnection.`;
    } else {
      return `Bot disconnected from the conversation whilst waiting a message that contained '${expectedResponse}'
Received before disconnection:
  ${responsesReceived.map((m) => ` - ${m.text}`).join('\n')}`;
    }
  }

  public get expectedResponse(): string {
    return this._expectedResponse;
  }

  public get responsesReceived(): ReadonlyArray<
    StructuredMessageTextBody | StructuredMessageStructuredBody
  > {
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

  private static containsDisconnectEvent(event: StructuredMessageEventBody): boolean {
    return event.events.some((e) => e.eventType === 'Presence' && e.presence.type === 'Disconnect');
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
   * Resolves on the next response from the other participant in the conversation that contains text.
   *
   * If you want to wait for a specific message use {@link waitForResponseWithTextContaining}.
   */
  public async waitForResponseText(): Promise<string> {
    return new Promise((resolve) => {
      this.messengerSession.once('structuredMessage', (event: StructuredMessage) => {
        if (
          (event.body.type === 'Text' || event.body.type === 'Structured') &&
          event.body.direction === 'Outbound'
        ) {
          resolve(event.body.text);
        }
      });
    });
  }

  /**
   * Wait for all responses until there is a predefined amount of 'silence'.
   */
  public async waitForResponses(timeToWaitAfterLastMessageInMs = 2000): Promise<string[]> {
    return new Promise((resolve) => {
      const messages: string[] = [];
      let waitingTimeout: NodeJS.Timeout;

      const func = (event: StructuredMessage) => {
        if (
          (event.body.type === 'Text' || event.body.type === 'Structured') &&
          event.body.direction === 'Outbound'
        ) {
          messages.push(event.body.text);

          if (waitingTimeout) {
            clearTimeout(waitingTimeout);
          }
          waitingTimeout = setTimeout(() => {
            this.messengerSession.off('structuredMessage', func);
            resolve(messages);
          }, timeToWaitAfterLastMessageInMs);
        }
      };

      // Set Initial wait
      waitingTimeout = setTimeout(() => {
        this.messengerSession.off('structuredMessage', func);
        resolve(messages);
      }, timeToWaitAfterLastMessageInMs);

      this.messengerSession.on('structuredMessage', func);
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
   * use {@link waitForResponseText}.
   */
  public async waitForResponseWithTextContaining(
    text: string,
    {
      timeoutInSeconds = 10,
      caseInsensitive = true,
    }: { timeoutInSeconds?: number; caseInsensitive?: boolean } = {},
  ): Promise<string> {
    const timeoutInMs = timeoutInSeconds * 1000;
    const messagesWithTextReceived: (
      | StructuredMessageTextBody
      | StructuredMessageStructuredBody
    )[] = [];

    return new Promise<string>((resolve, reject) => {
      let timeout: NodeJS.Timeout | undefined = undefined;

      const checkMessage = (event: StructuredMessage): void => {
        if (
          event.body.direction === 'Outbound' &&
          event.body.type === 'Event' &&
          Conversation.containsDisconnectEvent(event.body)
        ) {
          if (timeout) {
            clearTimeout(timeout);
          }
          reject(new BotDisconnectedWaitingForResponseError(text, messagesWithTextReceived));
        }

        if (event.body.type === 'Text' || event.body.type === 'Structured') {
          if (event.body.direction === 'Outbound') {
            messagesWithTextReceived.push(event.body);

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
        }
      };

      this.messengerSession.on('structuredMessage', checkMessage);

      timeout = setTimeout(() => {
        this.messengerSession.off('structuredMessage', checkMessage);

        reject(new TimeoutWaitingForResponseError(timeoutInMs, text, messagesWithTextReceived));
      }, timeoutInMs);
    });
  }
}
