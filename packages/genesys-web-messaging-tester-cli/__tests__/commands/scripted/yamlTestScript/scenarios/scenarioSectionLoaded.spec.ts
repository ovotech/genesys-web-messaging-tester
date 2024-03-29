import { accessSync, readFileSync } from 'fs';
import { Command } from 'commander';
import { when } from 'jest-when';
import { Conversation, WebMessengerSession } from '@ovotech/genesys-web-messaging-tester';
import stripAnsi from 'strip-ansi';
import { createCli } from '../../../../../src/createCli';

describe('Test script YAML loaded', () => {
  const validScenarioFilePath = '/test/path/config.json';

  let capturedOutput: {
    errOut: string[];
  };

  let fsReadFileSync: jest.MockedFunction<typeof readFileSync>;
  let fsAccessSync: jest.MockedFunction<typeof accessSync>;

  let webMessengerSession: jest.Mocked<Pick<WebMessengerSession, 'on' | 'close'>>;
  let conversation: jest.Mocked<Pick<Conversation, 'waitForConversationToStart' | 'sendText'>>;

  let cli: Command;

  beforeEach(() => {
    fsAccessSync = jest.fn();
    fsReadFileSync = jest.fn();

    webMessengerSession = { on: jest.fn(), close: jest.fn() };
    conversation = { waitForConversationToStart: jest.fn(), sendText: jest.fn() };

    capturedOutput = {
      errOut: [],
    };

    const cliCommand = new Command()
      .exitOverride(() => {
        throw new Error('CLI Command errored');
      })
      .configureOutput({
        writeErr: (str) => capturedOutput.errOut.push(str),
      });

    const scenarioTestCommand = new Command()
      .exitOverride(() => {
        throw new Error('Scenario Test Command errored');
      })
      .configureOutput({
        writeErr: (str) => capturedOutput.errOut.push(str),
      });

    cli = createCli(cliCommand, {
      command: scenarioTestCommand,
      fsReadFileSync,
      fsAccessSync,
      webMessengerSessionFactory: jest.fn().mockReturnValue(webMessengerSession),
      conversationFactory: jest.fn().mockReturnValue(conversation),
    });
  });

  test('Error output if file inaccessible', async () => {
    fsAccessSync.mockImplementation(() => {
      throw new Error('force app to exit');
    });

    await expect(
      cli.parseAsync([...['node', '/path/to/cli'], 'scripted', ...['test-file.yml']]),
    ).rejects.toBeDefined();

    expect(capturedOutput.errOut.map(stripAnsi)).toStrictEqual([
      "error: command-argument value 'test-file.yml' is invalid for argument 'filePath'. File 'test-file.yml' is not readable\n",
    ]);
  });

  test('Loads test script from YAML file', async () => {
    const yaml = `
config:
  deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  region: xxxx.pure.cloud
scenarios:
  scenario1:
    - say: hi from scenario 1
  scenario2:
    - say: hi from scenario 2
`;

    when(fsReadFileSync).calledWith(validScenarioFilePath, 'utf8').mockReturnValue(yaml);

    await cli.parseAsync([...['node', '/path/to/cli'], 'scripted', ...[validScenarioFilePath]]);

    expect(capturedOutput.errOut).toStrictEqual([]);

    expect(conversation.sendText).toHaveBeenCalledWith('hi from scenario 1');
    expect(conversation.sendText).toHaveBeenCalledWith('hi from scenario 2');
  });
});
