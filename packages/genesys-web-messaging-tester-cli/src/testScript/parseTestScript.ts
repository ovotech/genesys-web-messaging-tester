import { Conversation, SessionConfig } from '@ovotech/genesys-web-messaging-tester';
import stringTemplate from 'string-template';

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
  variables: Record<string, string>,
): (convo: Conversation) => Promise<unknown | void> {
  if ('say' in step) {
    const say = stringTemplate(step.say, variables);
    return async (convo) => convo.sendText(say);
  }

  if ('waitForReplyContaining' in step) {
    const waitForReplyContaining = stringTemplate(step.waitForReplyContaining, variables);
    return async (convo) => convo.waitForResponseContaining(waitForReplyContaining);
  }

  throw new Error(`Unsupported step ${step}`);
}

export function extractScenarios(
  testScript: Exclude<TestScriptFile, 'config'>,
  sessionConfig: SessionConfig,
  variables: Record<string, string>,
): TestScriptScenario[] {
  return Object.entries(testScript.scenarios ?? []).map(([scenarioName, actions]) => ({
    sessionConfig,
    name: scenarioName,
    steps: actions.map((a) => parseScenarioStep(a, variables)),
  }));
}
