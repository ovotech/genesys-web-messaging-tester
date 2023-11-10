import { SessionConfig } from '@ovotech/genesys-web-messaging-tester';

export interface AiScenarioSetupSection {
  readonly prompt: string;
  readonly terminatingPhrases: {
    readonly pass: string[];
    readonly fail: string[];
  };
}
export interface AiScenarioFollowUpSection {
  readonly prompt: string;
  readonly terminatingPhrases: {
    readonly pass: string[];
    readonly fail: string[];
  };
}

export interface AiScenarioSection {
  setup: AiScenarioSetupSection;
  followUp?: AiScenarioFollowUpSection;
}

export interface TestPromptFile {
  readonly config?: {
    readonly deploymentId: string;
    readonly region: string;
    readonly origin?: string;
  };
  readonly scenarios: {
    [name: string]: AiScenarioSection;
  };
}

export interface AiTestScript extends AiScenarioSection {
  readonly sessionConfig: SessionConfig;
  readonly name: string;
}

export function extractAiTestScenarios(
  testScript: Exclude<TestPromptFile, 'config'>,
  sessionConfig: SessionConfig,
): AiTestScript[] {
  return Object.entries(testScript.scenarios ?? []).map(([scenarioName, scenario]) => ({
    sessionConfig,
    name: scenarioName,
    setup: {
      prompt: scenario.setup.prompt,
      terminatingPhrases: {
        pass: scenario.setup.terminatingPhrases.pass ?? [],
        fail: scenario.setup.terminatingPhrases.fail ?? [],
      },
    },
    ...(scenario.followUp
      ? {
          followUp: {
            prompt: scenario.followUp.prompt,
            terminatingPhrases: {
              pass: scenario.followUp.terminatingPhrases.pass ?? [],
              fail: scenario.followUp.terminatingPhrases.fail ?? [],
            },
          },
        }
      : {}),
  }));
}
