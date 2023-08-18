import { Cli, createCli } from '../src/cli';
import { accessSync, readFileSync } from 'fs';
import { Command } from 'commander';
import {
  Conversation,
  WebMessageServerFixture,
  WebMessengerGuestSession,
} from '@ovotech/genesys-web-messaging-tester';
import stripAnsi from 'strip-ansi';
import getPort from 'get-port';
import WebSocket from 'ws';
import { waitForMs } from './fixtures/wait';

jest.setTimeout(50000);
describe('Test script YAML loaded', () => {
  let genesysServerFixture: WebMessageServerFixture;
  let latestConversation: Conversation;

  let capturedOutput: {
    errOut: string[];
    stdOut: string[];
  };

  let program: Command;
  let fsReadFileSync: jest.MockedFunction<typeof readFileSync>;
  let fsAccessSync: jest.MockedFunction<typeof accessSync>;

  let cli: Cli;

  beforeEach(async () => {
    genesysServerFixture = new WebMessageServerFixture(await getPort());

    fsAccessSync = jest.fn();
    fsReadFileSync = jest.fn();

    capturedOutput = {
      errOut: [],
      stdOut: [],
    };

    program = new Command();

    program.configureOutput({
      writeErr: (str) => {
        console.log(str);
        capturedOutput.errOut.push(str);
      },
      writeOut: (str: string) => {
        console.log(str);
        capturedOutput.stdOut.push(str);
      },
    });

    cli = createCli({
      program,
      fsReadFileSync,
      fsAccessSync,
      conversationFactory: (session) => {
        latestConversation = new Conversation(session);
        return latestConversation;
      },
      webMessengerSessionFactory: (config, reorderedMessageDelayer) =>
        new WebMessengerGuestSession(
          config,
          { IsTest: 'true' },
          reorderedMessageDelayer,
          () => new WebSocket(`ws://localhost:${genesysServerFixture.port}`),
        ),
      processExitOverride: () => {
        throw new Error('force app to exit');
      },
    });
  });

  afterEach(() => {
    genesysServerFixture.close();
  });

  test('passes when messages are in order', async () => {
    const yaml = `
config:
  deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  region: xxxx.pure.cloud
scenarios:
  scenario1:
    - say: hi
    - waitForReplyContaining: hello1
    - waitForReplyContaining: hello2
`;

    fsReadFileSync.mockReturnValue(yaml);
    const cliPromise = cli([...['node', '/path/to/cli'], ...['/test/path/config.json']]);

    const serverConnection = await genesysServerFixture.waitForConnection();

    serverConnection.simulateSessionResponseMessage();
    await latestConversation.waitForConversationToStart();

    await serverConnection.waitForMessage();
    serverConnection.simulateOutboundTextStructuredMessage('hello1');
    await waitForMs(2000);
    serverConnection.simulateOutboundTextStructuredMessage('hello2');

    try {
      await cliPromise;
    } catch (e) {
      console.error(e);
    }
    expect(capturedOutput.errOut.map(stripAnsi)).toStrictEqual([]);
    expect(capturedOutput.stdOut.map(stripAnsi).join('')).toStrictEqual(`
scenario1 (PASS)
---------------------
Them: hello1
Them: hello2

Scenario Test Results
---------------------
PASS - scenario1
`);
  });
  test('retries when messages are in out of order', async () => {
    const yaml = `
config:
  deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  region: xxxx.pure.cloud
scenarios:
  scenario1:
    - say: hi
    - waitForReplyContaining: hello1
    - waitForReplyContaining: hello2
`;

    fsReadFileSync.mockReturnValue(yaml);
    const cliPromise = cli([
      ...['node', '/path/to/cli'],
      ...['/test/path/config.json', '--timeout', '6'],
    ]); //.catch((e) => console.error(e));

    const serverConnection = await genesysServerFixture.waitForConnection();

    serverConnection.simulateSessionResponseMessage();
    await latestConversation.waitForConversationToStart();

    await serverConnection.waitForMessage();
    serverConnection.simulateOutboundTextStructuredMessage(
      'hello2',
      new Date('2001-01-01T01:01:16.001Z'),
    );
    await waitForMs(3000);
    serverConnection.simulateOutboundTextStructuredMessage(
      'hello1',
      new Date('2001-01-01T01:01:13.001Z'),
    );

    const [, serverConnection2] = await Promise.all([
      serverConnection.waitForConnectionToClose(),
      genesysServerFixture.waitForConnection(),
    ]);

    // Retry

    serverConnection2.simulateSessionResponseMessage();
    await latestConversation.waitForConversationToStart();

    await serverConnection2.waitForMessage();
    serverConnection2.simulateOutboundTextStructuredMessage(
      'hello2',
      new Date('2001-01-01T01:01:16.001Z'),
    );
    await waitForMs(3000);
    serverConnection2.simulateOutboundTextStructuredMessage(
      'hello1',
      new Date('2001-01-01T01:01:13.001Z'),
    );

    try {
      await cliPromise;
    } catch (e) {
      console.error(e);
    }
    expect(capturedOutput.errOut.map(stripAnsi)).toStrictEqual([]);
    expect(capturedOutput.stdOut.map(stripAnsi).join('')).toStrictEqual(`
scenario1 (PASS)
---------------------
Them: hello1
Them: hello2

Scenario Test Results
---------------------
PASS - scenario1
  ^ This test was retried following a failure that coincided with unordered messages being being received from Genesys
  Read more here: https://github.com/ovotech/genesys-web-messaging-tester/blob/main/docs/cli/unordered-messages.md
`);
  });
});
