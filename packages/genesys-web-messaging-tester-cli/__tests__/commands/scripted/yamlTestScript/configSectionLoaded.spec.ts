import { ScriptedTestCommandDependencies } from '../../../../src/commands/scriptedTest/createScriptedTestCommand';
import { readFileSync } from 'fs';
import { Command } from 'commander';
import { createCli } from '../../../../src/createCli';
import { ReorderedMessageDelayer } from '@ovotech/genesys-web-messaging-tester';

describe('Session Config', () => {
  let fsReadFileSync: jest.MockedFunction<typeof readFileSync>;

  let reorderedMessageDelayer: jest.Mocked<Pick<ReorderedMessageDelayer, 'delay' | 'add' | 'on'>>;
  let reorderedMessageDelayerFactory: jest.Mocked<
    ScriptedTestCommandDependencies['reorderedMessageDelayerFactory']
  >;
  let webMessengerSessionFactory: jest.Mocked<
    ScriptedTestCommandDependencies['webMessengerSessionFactory']
  >;
  let conversationFactory: jest.Mocked<ScriptedTestCommandDependencies['conversationFactory']>;

  let cli: Command;

  beforeEach(() => {
    fsReadFileSync = jest.fn();

    reorderedMessageDelayer = { delay: 0, add: jest.fn(), on: jest.fn() };
    reorderedMessageDelayerFactory = jest.fn().mockReturnValue(reorderedMessageDelayer);

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

    cli = createCli(cliCommand, {
      command: scenarioTestCommand,
      fsReadFileSync,
      fsAccessSync: jest.fn(),
      reorderedMessageDelayerFactory,
      webMessengerSessionFactory,
      conversationFactory,
    });
  });

  test('session config arguments take priority over config in Test Script', async () => {
    fsReadFileSync.mockReturnValue(`
config:
  deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  region: xxxx.pure.cloud
scenarios:
  exampleName:
    - say: "hi"
`);

    await cli.parseAsync([
      ...['node', '/path/to/cli'],
      'scripted',
      ...['--deployment-id', 'test-deployment-id'],
      ...['--region', 'test-region'],
      ...['--origin', 'test-origin'],
      ...['/test/path'],
    ]);

    expect(webMessengerSessionFactory).toHaveBeenCalledWith(
      {
        deploymentId: 'test-deployment-id',
        region: 'test-region',
        origin: 'test-origin',
      },
      reorderedMessageDelayer,
    );
  });

  test('Test-Script session config not necessary if session config args provided', async () => {
    fsReadFileSync.mockReturnValue(`
scenarios:
  exampleName:
    - say: "hi"
`);

    await cli.parseAsync([
      ...['node', '/path/to/cli'],
      'scripted',
      ...['--deployment-id', 'test-deployment-id-2'],
      ...['--region', 'test-region-2'],
      ...['--origin', 'test-origin-2'],
      ...['/test/path'],
    ]);

    expect(webMessengerSessionFactory).toHaveBeenCalledWith(
      {
        deploymentId: 'test-deployment-id-2',
        region: 'test-region-2',
        origin: 'test-origin-2',
      },
      reorderedMessageDelayer,
    );
  });

  test('Test-Script session config used if session config args not provided', async () => {
    fsReadFileSync.mockReturnValue(`
config:
  deploymentId: test-deployment-id-3
  region: test-region-3
  origin: test-origin-3
scenarios:
  exampleName:
    - say: "hi"
`);

    await cli.parseAsync([...['node', '/path/to/cli'], ...['scripted', '/test/path']]);

    expect(webMessengerSessionFactory).toHaveBeenCalledWith(
      {
        deploymentId: 'test-deployment-id-3',
        region: 'test-region-3',
        origin: 'test-origin-3',
      },
      reorderedMessageDelayer,
    );
  });
});
