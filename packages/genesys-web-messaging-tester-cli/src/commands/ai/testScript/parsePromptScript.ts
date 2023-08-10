import { SessionConfig } from '@ovotech/genesys-web-messaging-tester';

export interface PromptSection {
  readonly prompt: string;
  readonly terminatingResponses: {
    readonly pass: string[];
    readonly fail: string[];
  };
}

export interface TestPromptFile {
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
  testScript: Exclude<TestPromptFile, 'config'>,
  sessionConfig: SessionConfig,
): TestScriptAi[] {
  return Object.entries(testScript.prompts ?? []).map(([promptName, prompt]) => ({
    sessionConfig,
    name: promptName,
    prompt: prompt.prompt,
    terminatingResponses: {
      pass: prompt.terminatingResponses.pass ?? [],
      fail: prompt.terminatingResponses.fail ?? [],
    },
  }));
}
