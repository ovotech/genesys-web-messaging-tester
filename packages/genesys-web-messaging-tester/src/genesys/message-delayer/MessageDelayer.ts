import { EventEmitter } from 'events';
import { Response } from '../Response';

/**
 * Provides the ability to delay messages for the purpose of re-ordering them.
 * This is useful for reordering messages that are received out of order, presumably
 * due to it  being async and not guaranteeing order.
 */
export interface MessageDelayer extends EventEmitter {
  get delay(): number;
  add(message: Response<unknown>, whenReceived: Date): void;
}
