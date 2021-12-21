import { GenesysMessengerSession } from './genesys/GenesysMessengerSession';
import { StructuredMessage } from './genesys/StructuredMessage';
import { EventEmitter } from 'events';
import { When } from './When';
import { Then } from './Then';

export interface Step {
  readonly when: When;
  readonly then: Then;
}

export interface Scenario {
  openingMessage: string;
  dialogueSteps: Step[];
}

export interface ExchangeEvent {
  them?: string;
  you?: string;
}

export interface PassedEvent {
  scenario: Scenario;
}

export interface FailedEvent {
  reason: string;
  scenario: Scenario;
}

export function logExchange(event: ExchangeEvent) {
  if (event.them) {
    console.log(`Them: ${event.them}`);
  }
  if (event.you) {
    console.log(`You: ${event.you}`);
  }
}

export class ScenarioManager extends EventEmitter {
  private readonly stepIterator: IterableIterator<Step>;

  constructor(
    private readonly messengerSession: GenesysMessengerSession,
    private readonly scenario: Scenario,
  ) {
    super();
    this.stepIterator = scenario.dialogueSteps.values();

    this.messengerSession.on('sessionStarted', this.sessionStarted.bind(this));
    this.messengerSession.on('structuredMessage', this.structuredMessageReceived.bind(this));
  }

  public sessionStarted(): void {
    this.messengerSession.sendText(this.scenario.openingMessage);

    const event: ExchangeEvent = { you: this.scenario.openingMessage };
    this.emit('exchange', event);
  }

  public structuredMessageReceived(message: StructuredMessage): void {
    if (message.body.direction === 'Outbound') {
      const step = this.stepIterator.next();
      if (step.done) {
        this.emit('failed', { reason: 'No step available' });
        return;
      }
      const { when, then } = step.value;

      if (when.compare(message)) {
        const result = then.do(this.messengerSession);
        if (result && result.endOfScenario) {
          this.emitExchange({ them: message.body.text });
          this.emitPassed({ scenario: this.scenario });
        } else {
          this.emitExchange({ them: message.body.text, you: then.describe });
        }
      } else {
        this.emitExchange({ them: message.body.text });
        this.emitFailed({
          reason: `Message from Genesys '${message.body.text}' was not ${when.describe}`,
          scenario: this.scenario,
        });
      }
    }
  }

  private emitExchange(event: ExchangeEvent): void {
    this.emit('exchange', event);
  }

  private emitPassed(event: PassedEvent): void {
    this.emit('passed', event);
  }

  private emitFailed(event: FailedEvent): void {
    this.emit('failed', event);
  }
}
