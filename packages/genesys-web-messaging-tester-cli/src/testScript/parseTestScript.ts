import { SessionConfig } from '@ovotech/genesys-web-messaging-tester';
import { SayStepDefinition } from './steps/SayStepParser';
import { WaitForReplyContainingStepDefinition } from './steps/WaitForReplyContainingStepParser';
import { WaitForParticipantDataStepDefinition } from './steps/WaitForParticipantDataStepParser';

export type TestScriptFileScenarioStep =
  | SayStepDefinition
  | WaitForReplyContainingStepDefinition
  | WaitForParticipantDataStepDefinition;

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

// export type StepContext = {
//   conversationId: ReturnType<typeof createConversationIdGetter> | undefined;
// };

// export type Context = ScenarioStepRunnerParserContext &
//   WaitForReplyContainingStepRunnerContext &
//   WaitForParticipantDataStepRunnerContext;

export interface TestScriptScenario<T> {
  sessionConfig: SessionConfig;
  name: string;
  steps: ScenarioStepRunner<T>[];
}

export function parseScenarioStep<T>(
  stepDef: TestScriptFileScenarioStep,
  parsers: ScenarioStepRunnerParser<T>[],
): ScenarioStepRunner<T> {
  for (const parser of parsers) {
    if (parser.canParse(stepDef)) {
      return parser.parse(stepDef);
    }
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`Unsupported step ${stepDef}`);
}

export interface ScenarioStepRunnerParser<TContext> {
  canParse(step: TestScriptFileScenarioStep): boolean;
  parse(step: TestScriptFileScenarioStep): ScenarioStepRunner<TContext>;
}

export interface ScenarioStepRunner<TContext> {
  run(context: TContext): Promise<unknown>;
}

export function extractScenarios<T>(
  testScript: Exclude<TestScriptFile, 'config'>,
  sessionConfig: SessionConfig,
  parsers: ScenarioStepRunnerParser<T>[],
): TestScriptScenario<T>[] {
  return Object.entries(testScript.scenarios ?? []).map(([scenarioName, actions]) => ({
    sessionConfig,
    name: scenarioName,
    steps: actions.map((step) => parseScenarioStep(step, parsers)),
  }));
}
