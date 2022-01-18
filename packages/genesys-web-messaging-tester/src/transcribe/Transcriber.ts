import { WebMessengerGuestSession } from '../genesys/WebMessengerGuestSession';
import { StructuredMessage } from '../genesys/StructuredMessage';
import { EventEmitter } from 'events';

export interface TranscribedMessage {
  who: string;
  message: string;

  toString(): string;
}

export declare interface Transcriber {
  on(event: 'messageTranscribed', listener: (event: TranscribedMessage) => void): this;

  on(event: string, listener: Function): this;
}

/**
 * Transcribes a Web Messenger session into an array of transcribed messages.
 */
export class Transcriber extends EventEmitter {
  private readonly conversation: TranscribedMessage[];

  private readonly _nameForClient: string;
  private readonly _nameForServer: string;

  constructor(
    private readonly messengerSession: WebMessengerGuestSession,
    {
      nameForClient = 'You',
      nameForServer = 'Them',
    }: { nameForClient?: string; nameForServer?: string } = {},
  ) {
    super();
    this.conversation = [];
    this._nameForClient = nameForClient;
    this._nameForServer = nameForServer;

    this.messengerSession.on('structuredMessage', (event: StructuredMessage) => {
      this.recordStructuredMessage(event);
    });
  }

  private recordStructuredMessage(event: StructuredMessage): void {
    const who = event.body.direction === 'Inbound' ? this._nameForClient : this._nameForServer;
    const message = event.body.text;

    const interaction: TranscribedMessage = {
      who,
      message,
      toString: (): string => {
        return `${who}: ${message}`;
      },
    };

    this.conversation.push(interaction);
    this.emitInteraction(interaction);
  }

  private emitInteraction(interaction: TranscribedMessage): void {
    this.emit('messageTranscribed', interaction);
  }

  public getTranscript(): TranscribedMessage[] {
    return this.conversation;
  }
}
