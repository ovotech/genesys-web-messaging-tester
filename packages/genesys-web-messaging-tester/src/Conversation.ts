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
 * await convo.sendText('hi');
 *
 * await convo.waitForResponseContaining('Is this an example?');
 *
 * await convo.sendText('yes');
 *
 * const reply = await convo.waitForResponse();
 * console.log(reply);
 * ```
 */
export class Conversation {
  private sessionStarted: boolean;

  /**
   * When defining timeout durations we need to take into consideration the delay that occurs in the
   * WebMessengerSession to correct for out of order messages;
   * @private
   */
  private readonly timeoutCompensation: number;

  constructor(
    private readonly messengerSession: WebMessengerSession,
    private readonly timeoutSet: typeof setTimeout = setTimeout,
    private readonly timeoutClear: typeof clearTimeout = clearTimeout,
  ) {
    this.sessionStarted = false;
    this.messengerSession.once('sessionStarted', () => (this.sessionStarted = true));

    this.timeoutCompensation = messengerSession.messageDelayInMs;
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
   * @param delayInMs Delay in milliseconds between calling this method and the text being sent.
   *                  Without a delay some messages are sent so quickly after the original message
   *                  that Genesys Cloud doesn't acknowledge them.
   *                  A delay of 0 will result in the text being sent immediately.
   */
  public async sendText(text: string, delayInMs = 2000): Promise<void> {
    if (text.length === 0) {
      throw new Error('Text cannot be empty');
    }

    if (delayInMs > 0) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.messengerSession.sendText(text);
          resolve();
        }, delayInMs + this.timeoutCompensation);
      });
    } else {
      this.messengerSession.sendText(text);
    }
  }

  /**
   * Resolves on the next response from the other participant in the conversation that contains text.
   *
   * If you want to wait for a specific message use {@link waitForResponseWithTextContaining}.
   */
  public async waitForResponseText(): Promise<string> {
    return new Promise((resolve) => {
      this.messengerSession.on('structuredMessage', (event: StructuredMessage) => {
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
            this.timeoutClear(waitingTimeout);
          }
          waitingTimeout = this.timeoutSet(() => {
            this.messengerSession.off('structuredMessage', func);
            resolve(messages);
          }, timeToWaitAfterLastMessageInMs + this.timeoutCompensation);
        }
      };

      // Set Initial wait
      waitingTimeout = this.timeoutSet(() => {
        this.messengerSession.off('structuredMessage', func);
        resolve(messages);
      }, timeToWaitAfterLastMessageInMs + this.timeoutCompensation);

      this.messengerSession.on('structuredMessage', func);
    });
  }

  /**
   * Resolves when a response is received that contains a specific piece of text.
   * If no response is received that contains the text within the timeout period
   * then an exception is thrown.
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
    return this.waitForResponseWithCheck(
      {
        check(messageText: string): boolean {
          const message = caseInsensitive ? messageText.toLocaleLowerCase() : messageText;
          const expectedText = caseInsensitive ? text.toLocaleLowerCase() : text;

          return message.includes(expectedText);
        },
        describeCheck(): string {
          return text;
        },
      },
      timeoutInSeconds,
    );
  }

  /**
   * Resolves when a response is received that matches a regular expression.
   * If no response is received that matches the pattern within the timeout period
   * then an exception is thrown.
   *
   * If you want to wait for the next response, regardless of what it contains
   * use {@link waitForResponseText}.
   */
  public async waitForResponseWithTextMatchingPattern(
    pattern: string | RegExp,
    { timeoutInSeconds = 10 }: { timeoutInSeconds?: number } = {},
  ): Promise<string> {
    return this.waitForResponseWithCheck(
      {
        check(messageText: string): boolean {
          return new RegExp(pattern).test(messageText);
        },
        describeCheck(): string {
          return pattern.toString();
        },
      },
      timeoutInSeconds,
    );
  }

  /**
   * Resolves when a response is received that matches a check.
   * If no response is received that the check matches within the timeout period
   * then an exception is thrown.
   */
  private waitForResponseWithCheck(
    messageCheck: { check(messageText: string): boolean; describeCheck(): string },
    timeoutInSeconds: number,
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
            this.timeoutClear(timeout);
          }
          reject(
            new BotDisconnectedWaitingForResponseError(
              messageCheck.describeCheck(),
              messagesWithTextReceived,
            ),
          );
        }

        if (event.body.type === 'Text' || event.body.type === 'Structured') {
          if (event.body.direction === 'Outbound') {
            messagesWithTextReceived.push(event.body);

            if (messageCheck.check(event.body.text)) {
              this.messengerSession.off('structuredMessage', checkMessage);

              if (timeout) {
                this.timeoutClear(timeout);
              }
              resolve(event.body.text);
            }
          }
        }
      };

      this.messengerSession.on('structuredMessage', checkMessage);

      timeout = this.timeoutSet(() => {
        this.messengerSession.off('structuredMessage', checkMessage);

        reject(
          new TimeoutWaitingForResponseError(
            timeoutInMs,
            messageCheck.describeCheck(),
            messagesWithTextReceived,
          ),
        );
      }, timeoutInMs + this.timeoutCompensation);
    });
  }
}
