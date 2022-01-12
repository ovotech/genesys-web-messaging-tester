import { GenesysMessengerSession } from "../genesys/GenesysMessengerSession";
import { StructuredMessage } from "../genesys/StructuredMessage";

export class Transcriber {
  private readonly conversation: string[];

  constructor(private readonly messengerSession: GenesysMessengerSession) {
    this.conversation = [];

    this.messengerSession.on('structuredMessage', (event: StructuredMessage) => {
      this.recordStructuredMessage(event);
    });
  }

  private recordStructuredMessage(event: StructuredMessage): void {
    const who = event.body.direction === "Inbound" ? "You" : "Them";
    this.conversation.push(`${who}: ${event.body.text}`)
  }

  public getTranscript(): string[] {
    return this.conversation;
  }
}
