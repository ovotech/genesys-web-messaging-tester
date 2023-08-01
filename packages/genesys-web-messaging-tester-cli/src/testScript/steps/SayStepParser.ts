import { Conversation } from '@ovotech/genesys-web-messaging-tester';
import {
  ScenarioStepRunner,
  ScenarioStepRunnerParser,
  TestScriptFileScenarioStep,
} from '../parseTestScript';

export interface SayStepDefinition {
  readonly say: string;
}

export interface SayStepRunnerContext {
  convo: Conversation;
}

export class SayStepParser implements ScenarioStepRunnerParser<SayStepRunnerContext> {
  canParse(step: TestScriptFileScenarioStep): step is SayStepDefinition {
    return 'say' in step;
  }

  parse(step: TestScriptFileScenarioStep): ScenarioStepRunner<SayStepRunnerContext> {
    if (!this.canParse(step)) {
      throw new Error('Can not parse step');
    }
    return { run: ({ convo }) => convo.sendText(step.say) };
  }
}
