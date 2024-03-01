import { readFileSync } from 'fs';
import { Command } from 'commander';
import { createCli } from '../../../src/createCli';
import { ChatCompletionClient } from '../../../src/commands/aiTest/chatCompletionClients/chatCompletionClient';
import stripAnsi from 'strip-ansi';
import * as googleAi from '../../../src/commands/aiTest/chatCompletionClients/googleVertexAi/createChatCompletionClient';

describe('Vertex AI config', () => {
  let fsReadFileSync: jest.MockedFunction<typeof readFileSync>;

  let mockGoogleAiChatCompletionClientFactory: jest.MockedFn<
    typeof googleAi.createChatCompletionClient
  >;
  let mockGoogleAiChatCompletionClient: jest.Mocked<ChatCompletionClient>;

  let processEnv: NodeJS.ProcessEnv;

  let cli: Command;
  let capturedOutput: {
    errOut: string[];
    stdOut: string[];
  };

  beforeEach(() => {
    mockGoogleAiChatCompletionClient = {
      getProviderName: jest.fn().mockReturnValue('mock-google-vertex-ai'),
      predict: jest.fn().mockResolvedValue({ role: 'customer', content: 'PASS' }),
      preflightCheck: jest.fn().mockResolvedValue({ ok: true }),
    };
    mockGoogleAiChatCompletionClientFactory = jest
      .fn()
      .mockReturnValue(mockGoogleAiChatCompletionClient);

    capturedOutput = {
      errOut: [],
      stdOut: [],
    };
    fsReadFileSync = jest.fn();

    processEnv = {};

    const cliCommand = new Command().exitOverride(() => {
      throw new Error('CLI Command errored');
    });

    const scenarioTestCommand = new Command()
      .exitOverride(() => {
        throw new Error('Scenario Test Command errored');
      })
      .configureOutput({
        writeErr: (str) => {
          console.error(str);
          capturedOutput.errOut.push(str);
        },
        writeOut: (str) => {
          console.log(str);
          capturedOutput.stdOut.push(str);
        },
      });

    cli = createCli(cliCommand, undefined, {
      command: scenarioTestCommand,
      fsReadFileSync,
      fsAccessSync: jest.fn(),
      webMessengerSessionFactory: jest.fn().mockReturnValue({ on: jest.fn(), close: jest.fn() }),
      openAiCreateChatCompletionClient: () => {
        throw new Error('Not implemented');
      },
      googleAiCreateChatCompletionClient: mockGoogleAiChatCompletionClientFactory,
      conversationFactory: jest
        .fn()
        .mockReturnValue({ waitForConversationToStart: jest.fn(), sendText: jest.fn() }),
      processEnv,
    });
  });

  test('google-vertex-ai provider is loaded', async () => {
    fsReadFileSync.mockReturnValue(`
config:
  deploymentId: test-deployment-id
  region: test-region
  origin: test-origin
  ai:
    provider: google-vertex-ai
    config:
      project: test-project-from-config
      location: test-location-from-config
scenarios:
  Test:
    setup:
      prompt: Test prompt
      terminatingPhrases:
        pass: ["PASS"]
        fail: ["FAIL"]
  `);

    await cli.parseAsync([...['node', '/path/to/cli'], 'ai', ...['/test/path']]);

    expect(mockGoogleAiChatCompletionClientFactory).toHaveBeenCalledWith({
      location: 'test-location-from-config',
      project: 'test-project-from-config',
    });

    expect(mockGoogleAiChatCompletionClient.preflightCheck).toHaveBeenCalled();
    expect(mockGoogleAiChatCompletionClient.predict).toHaveBeenCalled();
    expect(capturedOutput.stdOut.map(stripAnsi).join('')).toContain(
      "Terminating phrase found in response: 'PASS'",
    );
  });

  test('project can be defined as an environment variable', async () => {
    processEnv['VERTEX_AI_PROJECT'] = 'test-project-from-env';
    processEnv['VERTEX_AI_LOCATION'] = 'test-location-from-env';

    fsReadFileSync.mockReturnValue(`
  config:
    deploymentId: test-deployment-id
    region: test-region
    origin: test-origin
    ai:
      provider: google-vertex-ai
  scenarios:
    Test:
      setup:
        prompt: Test prompt
        terminatingPhrases:
          pass: ["PASS"]
          fail: ["FAIL"]
    `);

    await cli.parseAsync([...['node', '/path/to/cli'], 'ai', ...['/test/path']]);

    expect(mockGoogleAiChatCompletionClientFactory).toHaveBeenCalledWith({
      location: 'test-location-from-env',
      project: 'test-project-from-env',
    });

    expect(mockGoogleAiChatCompletionClient.preflightCheck).toHaveBeenCalled();
    expect(mockGoogleAiChatCompletionClient.predict).toHaveBeenCalled();
    expect(capturedOutput.stdOut.map(stripAnsi).join('')).toContain(
      "Terminating phrase found in response: 'PASS'",
    );
  });

  test('loading fails if project and location not defined in either', async () => {
    fsReadFileSync.mockReturnValue(`
  config:
    deploymentId: test-deployment-id
    region: test-region
    origin: test-origin
    ai:
      provider: google-vertex-ai
      config:
        temperature: 123
  scenarios:
    Test:
      setup:
        prompt: Test prompt
        terminatingPhrases:
          pass: ["PASS"]
          fail: ["FAIL"]
    `);

    try {
      await cli.parseAsync([...['node', '/path/to/cli'], 'ai', ...['/test/path']]);
    } catch {
      /* Intentionally ignored */
    }

    expect(capturedOutput.errOut.map(stripAnsi).join('')).toContain(
      'Failed to validate Google Vertex AI Location and Project config. Provide these in the config file or via environment variables.',
    );
  });

  test('config loaded even if project and location defined in env variable', async () => {
    processEnv['VERTEX_AI_PROJECT'] = 'test-project-from-env';
    processEnv['VERTEX_AI_LOCATION'] = 'test-location-from-env';

    fsReadFileSync.mockReturnValue(`
  config:
    deploymentId: test-deployment-id
    region: test-region
    origin: test-origin
    ai:
      provider: google-vertex-ai
      config:
        temperature: 123
  scenarios:
    Test:
      setup:
        prompt: Test prompt
        terminatingPhrases:
          pass: ["PASS"]
          fail: ["FAIL"]
    `);

    await cli.parseAsync([...['node', '/path/to/cli'], 'ai', ...['/test/path']]);

    expect(mockGoogleAiChatCompletionClientFactory).toHaveBeenCalledWith({
      location: 'test-location-from-env',
      project: 'test-project-from-env',
      temperature: 123,
    });

    expect(capturedOutput.stdOut.map(stripAnsi).join('')).toContain(
      "Terminating phrase found in response: 'PASS'",
    );
  });
});
