import { Conversation, SessionConfig } from '@ovotech/genesys-web-messaging-tester';

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
  };
  readonly scenarios: {
    [key: string]: TestScriptFileScenarioStep[];
  };
}

export interface TestScriptScenario {
  sessionConfig: SessionConfig;
  name: string;
  steps: ((convo: Conversation) => Promise<unknown>)[];
}

export function parseScenarioStep(
  step: TestScriptFileScenarioStep,
): (convo: Conversation) => Promise<unknown | void> {
  if ('say' in step) {
    return async (convo) => convo.sendText(step.say);
  }

  if ('waitForReplyContaining' in step) {
    return async (convo) => convo.waitForResponseContaining(step.waitForReplyContaining);
  }

  throw new Error(`Unsupported step ${step}`);
}

export function extractScenarios(
  testScript: Exclude<TestScriptFile, 'config'>,
  sessionConfig: SessionConfig,
): TestScriptScenario[] {
  return Object.entries(testScript.scenarios ?? []).map(([scenarioName, actions]) => ({
    sessionConfig,
    name: scenarioName,
    steps: actions.map(parseScenarioStep),
  }));
}
