import { readFileSync } from 'fs';
import { Command } from 'commander';
import { AiTestCommandDependencies } from '../../../src/commands/aiTest/createAiTestCommand';
import { createCli } from '../../../src/createCli';
import { ChatCompletionClient } from '../../../src/commands/aiTest/chatCompletionClients/chatCompletionClient';

describe('Session Config', () => {
  let fsReadFileSync: jest.MockedFunction<typeof readFileSync>;

  let webMessengerSessionFactory: jest.Mocked<
    AiTestCommandDependencies['webMessengerSessionFactory']
  >;
  let conversationFactory: jest.Mocked<AiTestCommandDependencies['conversationFactory']>;
  let mockOpenAiChatCompletionClient: jest.Mocked<ChatCompletionClient>;
  let mockGoogleAiChatCompletionClient: jest.Mocked<ChatCompletionClient>;

  let cli: Command;

  beforeEach(() => {
    fsReadFileSync = jest.fn();

    const webMessengerSession = { on: jest.fn(), close: jest.fn() };
    webMessengerSessionFactory = jest.fn().mockReturnValue(webMessengerSession);

    const conversation = { waitForConversationToStart: jest.fn(), sendText: jest.fn() };
    conversationFactory = jest.fn().mockReturnValue(conversation);

    const cliCommand = new Command().exitOverride(() => {
      throw new Error('CLI Command errored');
    });

    const scenarioTestCommand = new Command().exitOverride(() => {
      throw new Error('Scenario Test Command errored');
    });

    cli = createCli(cliCommand, undefined, {
      command: scenarioTestCommand,
      fsReadFileSync,
      fsAccessSync: jest.fn(),
      webMessengerSessionFactory,
      openAiCreateChatCompletionClient: () => mockOpenAiChatCompletionClient,
      googleAiCreateChatCompletionClient: () => mockGoogleAiChatCompletionClient,
      conversationFactory,
      processEnv: { OPENAI_API_KEY: 'test' },
    });
  });

  test('session config in Test Script loaded', async () => {
    fsReadFileSync.mockReturnValue(`
config:
  deploymentId: test-deployment-id-1
  region: test-region-1
  origin: test-origin-1
  ai:
    provider: chatgpt
scenarios:
  Test:
    setup:
      prompt: Test prompt
      terminatingPhrases:
        pass: ["PASS"]
        fail: ["FAIL"]
`);
    mockOpenAiChatCompletionClient = {
      getProviderName: jest.fn().mockReturnValue('mock-chatgpt'),
      predict: jest.fn().mockResolvedValue({ role: 'customer', content: 'PASS' }),
      preflightCheck: jest.fn().mockResolvedValue({ ok: true }),
    };

    await cli.parseAsync([...['node', '/path/to/cli'], 'ai', ...['/test/path']]);

    expect(webMessengerSessionFactory).toHaveBeenCalledWith({
      deploymentId: 'test-deployment-id-1',
      region: 'test-region-1',
      origin: 'test-origin-1',
    });
  });

  test('session config only necessary for ai provider if session config args provided', async () => {
    fsReadFileSync.mockReturnValue(`
config:
  deploymentId: test-deployment-id-1
  region: test-region-1
  origin: test-origin-1
  ai:
    provider: google-vertex-ai
    config:
      project: test-project
      location: test-location
scenarios:
  Test:
    setup:
      prompt: Test prompt
      terminatingPhrases:
        pass: ["PASS"]
        fail: ["FAIL"]
  `);

    mockGoogleAiChatCompletionClient = {
      getProviderName: jest.fn().mockReturnValue('mock-google-vertex-ai'),
      predict: jest.fn().mockResolvedValue({ role: 'customer', content: 'PASS' }),
      preflightCheck: jest.fn().mockResolvedValue({ ok: true }),
    };

    await cli.parseAsync([
      ...['node', '/path/to/cli'],
      'ai',
      ...['--deployment-id', 'test-deployment-id-2'],
      ...['--region', 'test-region-2'],
      ...['--origin', 'test-origin-2'],
      ...['/test/path'],
    ]);

    expect(webMessengerSessionFactory).toHaveBeenCalledWith({
      deploymentId: 'test-deployment-id-2',
      region: 'test-region-2',
      origin: 'test-origin-2',
    });
  });
});
