import { GenesysMessengerSession } from '../genesys/GenesysMessengerSession';
import { StructuredMessage } from '../genesys/StructuredMessage';
import { EventEmitter } from 'events';

export interface Interaction {
  who: 'Them' | 'You';
  message: string;
}

export class Transcriber extends EventEmitter {
  private readonly conversation: Interaction[];

  constructor(private readonly messengerSession: GenesysMessengerSession) {
    super();
    this.conversation = [];

    this.messengerSession.on('structuredMessage', (event: StructuredMessage) => {
      this.recordStructuredMessage(event);
    });
  }

  private recordStructuredMessage(event: StructuredMessage): void {
    const who = event.body.direction === 'Inbound' ? 'You' : 'Them';

    const interaction: Interaction = { who, message: event.body.text };

    this.conversation.push(interaction);
    this.emitInteraction(interaction);
  }

  private emitInteraction(interaction: Interaction): void {
    this.emit('interaction', interaction);
  }

  public getTranscript(): Interaction[] {
    return this.conversation;
  }
}
