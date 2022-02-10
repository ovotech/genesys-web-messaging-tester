import { Cli, createCli } from '../src/cli';
import { accessSync, readFileSync } from 'fs';
import { Command } from 'commander';
import { when } from 'jest-when';
import { Conversation, WebMessengerSession } from '@ovotech/genesys-web-messaging-tester';

describe('Test script YAML loaded', () => {
  const validScenarioFilePath = '/test/path/config.json';

  let capturedOutput: {
    errOut: string[];
  };

  let program: Command;
  let fsReadFileSync: jest.MockedFunction<typeof readFileSync>;
  let fsAccessSync: jest.MockedFunction<typeof accessSync>;

  let webMessengerSession: jest.Mocked<Pick<WebMessengerSession, 'on' | 'close'>>;
  let conversation: jest.Mocked<Pick<Conversation, 'waitForConversationToStart' | 'sendText'>>;

  let cli: Cli;

  beforeEach(() => {
    fsAccessSync = jest.fn();
    fsReadFileSync = jest.fn();

    webMessengerSession = { on: jest.fn(), close: jest.fn() };
    conversation = { waitForConversationToStart: jest.fn(), sendText: jest.fn() };

    capturedOutput = {
      errOut: [],
    };

    program = new Command();

    program.configureOutput({
      writeErr: (str) => capturedOutput.errOut.push(str),
    });

    cli = createCli({
      program,
      fsReadFileSync,
      fsAccessSync,
      webMessengerSessionFactory: jest.fn().mockReturnValue(webMessengerSession),
      conversationFactory: jest.fn().mockReturnValue(conversation),
      processExitOverride: () => {
        throw new Error('force app to exit');
      },
    });
  });

  test('Replaces template named argument with', async () => {
    const yaml = `
config:
  deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  region: xxxx.pure.cloud
scenarios:
  scenario1:
    - say: hello {name}
`;

    when(fsReadFileSync).calledWith(validScenarioFilePath, 'utf8').mockReturnValue(yaml);

    await cli([
      ...['node', '/path/to/cli'],
      ...['--test-script-path', validScenarioFilePath],
      ...['-var', '"name=Lucas"'],
    ]);

    expect(capturedOutput.errOut).toStrictEqual([]);

    expect(conversation.sendText).toHaveBeenCalledWith('hello Lucas');
  });
});
