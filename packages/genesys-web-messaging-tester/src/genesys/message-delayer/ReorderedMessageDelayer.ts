import { EventEmitter } from 'events';
import debug from 'debug';
import { Response } from '../Response';
import { clearTimeout, setTimeout } from 'timers';
import { orderByTimestamp } from './orderByTimestamp';
import { MessageDelayer } from './MessageDelayer';
import { isStructuredMessage } from '../WebMessengerGuestSession';
import { StructuredMessage } from '../StructuredMessage';

/**
 * Reorders messages with a timestamp. This maintains the overall order of messages with/without
 * timestamps.
 */
export class ReorderedMessageDelayer extends EventEmitter implements MessageDelayer {
  private static readonly debugger = debug('ReorderedMessageDelayer');

  private static readonly DELAY_IN_MS = 2000;
  private messages: Response<unknown>[] = [];

  private timerReference: NodeJS.Timeout | undefined;

  private lastMessageWithTimestamp: StructuredMessage | undefined = undefined;

  constructor(
    private readonly timeoutSet: typeof setTimeout = setTimeout,
    private readonly timeoutClear: typeof clearTimeout = clearTimeout,
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

    this.clearDelay();

    this.messages.push(message);

    this.startLoop();
  }

  private clearDelay(): void {
    if (this.timerReference) {
      this.timeoutClear(this.timerReference);
      this.timerReference = undefined;
    }
  }

  private startLoop(): void {
    this.timerReference = this.timeoutSet(() => {
      this.releaseOldestMessage();
      if (this.messages.length > 0) {
        this.startLoop();
      }
    }, ReorderedMessageDelayer.DELAY_IN_MS);
  }

  private releaseOldestMessage(): void {
    if (this.messages.length > 0) {
      const result = orderByTimestamp(this.messages);
      if (result.wasRearranged) {
        ReorderedMessageDelayer.debugger('Messages out of order: %O', this.messages);
      }

      this.messages = result.responses;

      this.emit('message', this.messages.shift());
    }
  }

  public get delay(): number {
    return ReorderedMessageDelayer.DELAY_IN_MS;
  }
}
