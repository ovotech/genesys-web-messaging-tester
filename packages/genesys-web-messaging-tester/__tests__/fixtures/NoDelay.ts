import { EventEmitter } from 'events';
import { MessageDelayer, Response } from '../../src';

export class NoDelay extends EventEmitter implements MessageDelayer {
  constructor() {
    super();
  }

  public add(message: Response<unknown>): void {
    this.emit('message', message);
  }

  get delay(): number {
    return 0;
  }
}
