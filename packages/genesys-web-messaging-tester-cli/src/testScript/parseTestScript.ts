import { Conversation } from '@ovotech/genesys-web-messaging-tester';

export type TestScriptFileScenarioStep =
  | {
      readonly say: string;
    }
  | {
      readonly waitForReplyContaining: string;
    };

export interface TestScriptFile {
  readonly config?: {
    readonly deploymentId: string;
    readonly region: string;
    readonly origin?: string;
    readonly stepTimeoutInSeconds?: number;
  };
  readonly scenarios: {
    [key: string]: TestScriptFileScenarioStep[];
  };
}

export interface TestScriptScenario {
  sessionConfig: NonNullable<TestScriptFile['config']>;
  name: string;
  steps: ((convo: Conversation) => Promise<unknown>)[];
}


export function parseScenarioStep(timeoutInSeconds?:number) {
  return function(
    step: TestScriptFileScenarioStep,
  ): (convo: Conversation) => Promise<unknown | void> {
    if ('say' in step) {
      return async (convo) => convo.sendText(step.say);
    }

    if ('waitForReplyContaining' in step) {
      return async (convo) => convo.waitForResponseContaining(step.waitForReplyContaining, {timeoutInSeconds});
    }

    throw new Error(`Unsupported step ${step}`);
  }
}

export function extractScenarios(
  testScript: Exclude<TestScriptFile, 'config'>,
  sessionConfig: NonNullable<TestScriptFile['config']>,
): TestScriptScenario[] {
  return Object.entries(testScript.scenarios ?? []).map(([scenarioName, actions]) => ({
    sessionConfig,
    name: scenarioName,
    steps: actions.map(parseScenarioStep(sessionConfig?.stepTimeoutInSeconds)),
  }));
}
