import { readFileSync } from 'fs';
import { Command } from 'commander';
import { createCli } from '../../../src/createCli';
import { ChatCompletionClient } from '../../../src/commands/aiTest/chatCompletionClients/chatCompletionClient';

describe('ChatGPT config', () => {
  let fsReadFileSync: jest.MockedFunction<typeof readFileSync>;

  let mockOpenAiChatCompletionClient: jest.Mocked<ChatCompletionClient>;

  let cli: Command;
  let capturedOutput: {
    errOut: string[];
    stdOut: string[];
  };

  beforeEach(() => {
    fsReadFileSync = jest.fn();

    capturedOutput = {
      errOut: [],
      stdOut: [],
    };

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
      fsWriteFileSync: jest.fn(),
      webMessengerSessionFactory: jest.fn().mockReturnValue({ on: jest.fn(), close: jest.fn() }),
      openAiCreateChatCompletionClient: () => mockOpenAiChatCompletionClient,
      googleAiCreateChatCompletionClient: () => {
        throw new Error('Not implemented');
      },
      conversationFactory: jest
        .fn()
        .mockReturnValue({ waitForConversationToStart: jest.fn(), sendText: jest.fn() }),
      processEnv: { OPENAI_API_KEY: 'test' },
    });
  });

  test('ChatGPT provider is loaded', async () => {
    fsReadFileSync.mockReturnValue(`
config:
  deploymentId: test-deployment-id
  region: test-region
  origin: test-origin
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

    expect(mockOpenAiChatCompletionClient.preflightCheck).toHaveBeenCalled();
    expect(mockOpenAiChatCompletionClient.predict).toHaveBeenCalled();
  });
});
