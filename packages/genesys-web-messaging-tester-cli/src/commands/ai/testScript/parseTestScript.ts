import { SessionConfig } from '@ovotech/genesys-web-messaging-tester';

export interface PromptSection {
  readonly prompt: string;
  readonly terminatingResponses: {
    readonly passing: string[];
    readonly failing: string[];
  };
}

export interface TestScriptFile {
  readonly config?: {
    readonly deploymentId: string;
    readonly region: string;
    readonly origin?: string;
  };
  readonly prompts: {
    [name: string]: PromptSection;
  };
}

export interface TestScriptAi extends PromptSection {
  readonly sessionConfig: SessionConfig;
  readonly name: string;
}

export function extractPrompts(
  testScript: Exclude<TestScriptFile, 'config'>,
  sessionConfig: SessionConfig,
): TestScriptAi[] {
  return Object.entries(testScript.prompts ?? []).map(([promptName, prompt]) => ({
    sessionConfig,
    name: promptName,
    prompt: prompt.prompt,
    terminatingResponses: {
      passing: prompt.terminatingResponses.passing ?? [],
      failing: prompt.terminatingResponses.failing ?? [],
    },
  }));
}
