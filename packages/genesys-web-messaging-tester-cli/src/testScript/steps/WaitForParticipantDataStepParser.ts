import {
  ScenarioStepRunner,
  ScenarioStepRunnerParser,
  TestScriptFileScenarioStep,
} from '../parseTestScript';
import { ConversationIdGetter } from '../../genesysPlatform/messageIdToConversationIdFactory';

export interface WaitForParticipantDataStepDefinition {
  readonly waitForParticipantData: Record<string, string>;
}

export interface WaitForParticipantDataStepRunnerContext {
  conversationId: ConversationIdGetter | undefined;
}

export class WaitForParticipantDataStepParser
  implements ScenarioStepRunnerParser<WaitForParticipantDataStepRunnerContext>
{
  public static preflightCheck(
    associateId: boolean,
  ): { canRun: true } | { canRun: false; reason: string } {
    if (associateId) {
      return { canRun: true };
    }
    return { canRun: true };
  }

  private _hasParsed = false;

  public get hasParsed(): boolean {
    return this._hasParsed;
  }

  canParse(step: TestScriptFileScenarioStep): step is WaitForParticipantDataStepDefinition {
    return 'waitForParticipantData' in step;
  }

  parse(
    step: TestScriptFileScenarioStep,
  ): ScenarioStepRunner<WaitForParticipantDataStepRunnerContext> {
    if (!this.canParse(step)) {
      throw new Error('Can not parse step');
    }

    this._hasParsed = true;
    return {
      run: ({ conversationId }) => {
        console.log({ conversationId });
        return Promise.reject(new Error('Not implemented'));
      },
    };
  }
}
