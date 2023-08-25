import { SessionConfig } from '@ovotech/genesys-web-messaging-tester';

export interface ExploratoryScenarioSetupSection {
  readonly prompt: string;
  readonly terminatingPhrases: {
    readonly pass: string[];
    readonly fail: string[];
  };
}

export interface ExploratoryScenarioSection {
  setup: ExploratoryScenarioSetupSection;
}

export interface TestPromptFile {
  readonly config?: {
    readonly deploymentId: string;
    readonly region: string;
    readonly origin?: string;
  };
  readonly scenarios: {
    [name: string]: ExploratoryScenarioSection;
  };
}

export interface ExploratoryTestScript extends ExploratoryScenarioSection {
  readonly sessionConfig: SessionConfig;
  readonly name: string;
}

export function extractExploratoryTestScenarios(
  testScript: Exclude<TestPromptFile, 'config'>,
  sessionConfig: SessionConfig,
): ExploratoryTestScript[] {
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
  }));
}
