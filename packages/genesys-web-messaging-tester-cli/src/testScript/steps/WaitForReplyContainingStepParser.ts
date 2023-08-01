import { Conversation } from '@ovotech/genesys-web-messaging-tester';
import {
  ScenarioStepRunner,
  ScenarioStepRunnerParser,
  TestScriptFileScenarioStep,
} from '../parseTestScript';

export interface WaitForReplyContainingStepDefinition {
  readonly waitForReplyContaining: string;
}

export interface WaitForReplyContainingStepRunnerContext {
  convo: Conversation;
}

export class WaitForReplyContainingStepParser
  implements ScenarioStepRunnerParser<WaitForReplyContainingStepRunnerContext>
{
  canParse(step: TestScriptFileScenarioStep): step is WaitForReplyContainingStepDefinition {
    return 'waitForReplyContaining' in step;
  }

  parse(
    step: TestScriptFileScenarioStep,
  ): ScenarioStepRunner<WaitForReplyContainingStepRunnerContext> {
    if (!this.canParse(step)) {
      throw new Error('Can not parse step');
    }
    return {
      run: ({ convo }) => convo.waitForResponseWithTextContaining(step.waitForReplyContaining),
    };
  }
}
