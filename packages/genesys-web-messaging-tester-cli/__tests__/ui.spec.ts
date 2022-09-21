import { Cli, createCli } from '../src/cli';
import { accessSync, readFileSync } from 'fs';
import { Command } from 'commander';
import { Conversation, WebMessengerSession } from '@ovotech/genesys-web-messaging-tester';
import stripAnsi from 'strip-ansi';

describe('Test script YAML loaded', () => {
  let capturedOutput: {
    errOut: string[];
    stdOut: string[];
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
      stdOut: [],
    };

    program = new Command();

    program.configureOutput({
      writeErr: (str) => capturedOutput.errOut.push(str),
      writeOut: (str: string) => capturedOutput.stdOut.push(str),
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

  test('Summary at end of test', async () => {
    const yaml = `
config:
  deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  region: xxxx.pure.cloud
scenarios:
  scenario1:
    - say: hi from scenario 1
`;

    fsReadFileSync.mockReturnValue(yaml);
    await cli([...['node', '/path/to/cli'], ...['/test/path/config.json']]);

    expect(capturedOutput.errOut.map(stripAnsi)).toStrictEqual([]);
    expect(capturedOutput.stdOut.map(stripAnsi).join('')).toStrictEqual(`
scenario1 (PASS)
---------------------

Scenario Test Results
---------------------
PASS - scenario1
`);
  });
});
