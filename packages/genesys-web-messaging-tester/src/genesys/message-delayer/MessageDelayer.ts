import { EventEmitter } from 'events';
import { Response } from '../Response';
import { orderByTimestamp } from './orderByTimestamp';

/**
 * Provides the ability to delay messages for the purpose of re-ordering them.
 * This is useful for reordering messages that are received out of order, presumably
 * due to it  being async and not guaranteeing order.
 */
export interface MessageDelayer extends EventEmitter {
  add(message: Response<unknown>): void;
}

/**
 * Reorders messages with a timestamp. This maintains the overall order of messages with/without
 * timestamps.
 */
export class ReorderedMessageDelayer extends EventEmitter implements MessageDelayer {
  private static readonly DELAY_IN_MS = 2000;
  private messages: Response<unknown>[] = [];

  private timerReference: NodeJS.Timeout | undefined;

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
      this.messages = orderByTimestamp(this.messages);
      this.emit('message', this.messages.shift());
    }
  }
}
