import { Conversation, SessionConfig } from '@ovotech/genesys-web-messaging-tester';

export type TestScriptFileScenarioStep =
  | {
      readonly say: string;
    }
  | {
      readonly waitForReplyContaining: string;
    }
  | {
      readonly waitForReplyMatching: RegExp;
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

export interface StepContext {
  timeoutInSeconds: number;
}

export interface TestScriptScenario {
  sessionConfig: SessionConfig;
  name: string;
  steps: ((convo: Conversation, context: StepContext) => Promise<unknown>)[];
}

export function parseScenarioStep(
  step: TestScriptFileScenarioStep,
): (convo: Conversation, context: StepContext) => Promise<unknown | void> {
  if ('say' in step) {
    return async (convo) => await convo.sendText(step.say);
  }

  if ('waitForReplyContaining' in step) {
    return async (convo, context) =>
      await convo.waitForResponseWithTextContaining(step.waitForReplyContaining, {
        timeoutInSeconds: context.timeoutInSeconds,
      });
  }

  if ('waitForReplyMatching' in step) {
    return async (convo, context) =>
      await convo.waitForResponseWithTextMatchingPattern(
        new RegExp(step.waitForReplyMatching, 'im'),
        { timeoutInSeconds: context.timeoutInSeconds },
      );
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
