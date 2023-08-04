import { EventEmitter } from 'events';
import { Response } from '../../src/genesys/Response';
import { MessageDelayer } from '../../src/genesys/message-delayer/MessageDelayer';

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
