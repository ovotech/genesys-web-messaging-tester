import { EventEmitter } from 'events';
import debug from 'debug';
import { Response } from '../Response';
import { setInterval } from 'timers';
import { orderByTimestamp } from './orderByTimestamp';
import { MessageDelayer } from './MessageDelayer';
import { isStructuredMessage } from '../WebMessengerGuestSession';
import { StructuredMessage } from '../StructuredMessage';

/**
 * Reorders messages with a timestamp, being sure to maintain the overall order of messages with/without
 * timestamps.
 */
export class ReorderedMessageDelayer extends EventEmitter implements MessageDelayer {
  private static readonly debugger = debug('ReorderedMessageDelayer');

  private static readonly SILENCE_TO_WAIT_IN_MS = 5000;
  private static readonly INTERVAL = 1000;
  private messages: Response<unknown>[] = [];

  private lastMessageWithTimestamp: StructuredMessage | undefined = undefined;

  private intervalReference: NodeJS.Timeout | undefined;

  constructor(
    private readonly intervalSet: typeof setInterval = setInterval,
    private readonly intervalClear: typeof clearInterval = clearInterval,
  ) {
    super();
  }

  /**
   * Add a message to the pool. Each message added reset a timer to wait for any other messages
   * before releasing the oldest message.
   */
  public add(message: Response<unknown>): void {
    if (isStructuredMessage(message)) {
      if (this.lastMessageWithTimestamp) {
        const timeDifference =
          new Date(message.body.channel.time).getTime() -
          new Date(this.lastMessageWithTimestamp.body.channel.time).getTime();

        if (timeDifference < 0) {
          ReorderedMessageDelayer.debugger(
            "Message received was out of order. Last msg's timestamp came before this one by %d ms",
            -timeDifference,
          );
        } else {
          // If timeDifference check above is true then last message is more recent so keep, else update below
          this.lastMessageWithTimestamp = message;
        }
      } else {
        this.lastMessageWithTimestamp = message;
      }
    }

    this.messages.push(message);

    if (!this.intervalReference) {
      this.startInterval();
    }
  }

  private startInterval(): void {
    if (!this.intervalReference) {
      this.intervalReference = this.intervalSet(
        () => this.emitMessagesAfterSilence(),
        ReorderedMessageDelayer.INTERVAL,
      );
    }
  }

  private stopInterval(): void {
    if (this.intervalReference) {
      this.intervalClear(this.intervalReference);
      this.intervalReference = undefined;
    }
  }

  private emitMessagesAfterSilence(): void {
    if (this.messages.length === 0) {
      this.stopInterval();
      return;
    }

    const result = orderByTimestamp(this.messages);
    if (result.wasRearranged) {
      ReorderedMessageDelayer.debugger(
        'Flushing messages. Out of order message detected: %O',
        this.messages,
      );
    } else {
      ReorderedMessageDelayer.debugger('Flushing messages. No out of order messages');
    }

    this.messages = result.responses;

    let finished = false;
    const now = new Date().getTime();
    do {
      if (isStructuredMessage(this.messages[0])) {
        const ageOfMessageInMs = now - new Date(this.messages[0].body.channel.time).getTime();
        if (ageOfMessageInMs >= ReorderedMessageDelayer.SILENCE_TO_WAIT_IN_MS) {
          this.emit('message', this.messages.shift());
          ReorderedMessageDelayer.debugger('Emitted message with timestamp: %O', {
            msDelayed: ageOfMessageInMs,
          });
        } else {
          finished = true;
        }
      } else {
        // No timestamp so just emit
        this.emit('message', this.messages.shift());
        ReorderedMessageDelayer.debugger('Emitted message without timestamp');
      }
    } while (!finished && this.messages.length > 0);
  }

  public get delay(): number {
    return ReorderedMessageDelayer.SILENCE_TO_WAIT_IN_MS;
  }
}
