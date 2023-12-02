import { readFileSync } from 'fs';
import { Command } from 'commander';
import { AiTestCommandDependencies } from '../../../lib/commands/aiTest/createAiTestCommand';
import { createCli } from '../../../src/createCli';
import { OpenAI } from 'openai';
import { ChatCompletion } from 'openai/src/resources/chat/completions';

describe('Session Config', () => {
  let fsReadFileSync: jest.MockedFunction<typeof readFileSync>;

  let webMessengerSessionFactory: jest.Mocked<
    AiTestCommandDependencies['webMessengerSessionFactory']
  >;
  let conversationFactory: jest.Mocked<AiTestCommandDependencies['conversationFactory']>;
  let mockOpenApiChatCompletions: jest.Mocked<Pick<OpenAI.Chat.Completions, 'create'>>;

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
      openAiChatCompletionFactory: () => mockOpenApiChatCompletions,
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
scenarios:
  Test:
    setup:
      prompt: Test prompt
      terminatingPhrases:
        pass: ["PASS"]
        fail: ["FAIL"]
`);
    const completion: ChatCompletion = {
      choices: [{ message: { role: 'system', content: 'PASS' }, finish_reason: 'stop', index: 0 }],
      created: 0,
      id: '',
      model: '',
      object: '',
    };

    mockOpenApiChatCompletions = { create: jest.fn().mockResolvedValue(completion) };

    await cli.parseAsync([...['node', '/path/to/cli'], 'ai', ...['/test/path']]);

    expect(webMessengerSessionFactory).toHaveBeenCalledWith({
      deploymentId: 'test-deployment-id-1',
      region: 'test-region-1',
      origin: 'test-origin-1',
    });
  });

  test('session config not necessary if session config args provided', async () => {
    fsReadFileSync.mockReturnValue(`
  scenarios:
    Test:
      setup:
        prompt: Test prompt
        terminatingPhrases:
          pass: ["PASS"]
          fail: ["FAIL"]
  `);

    const completion: ChatCompletion = {
      choices: [{ message: { role: 'system', content: 'PASS' }, finish_reason: 'stop', index: 0 }],
      created: 0,
      id: '',
      model: '',
      object: '',
    };

    mockOpenApiChatCompletions = {
      create: jest.fn().mockResolvedValue(completion),
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
