import { Cli, createCli, Dependencies } from '../../src/cli';
import { readFileSync } from 'fs';
import { Command } from 'commander';

describe('Session Config', () => {
  let program: Command;
  let fsReadFileSync: jest.MockedFunction<typeof readFileSync>;

  let webMessengerSessionFactory: jest.Mocked<Dependencies['webMessengerSessionFactory']>;
  let conversationFactory: jest.Mocked<Dependencies['conversationFactory']>;

  let cli: Cli;

  beforeEach(() => {
    fsReadFileSync = jest.fn();

    const webMessengerSession = { on: jest.fn(), close: jest.fn() };
    webMessengerSessionFactory = jest.fn().mockReturnValue(webMessengerSession);

    const conversation = { waitForConversationToStart: jest.fn(), sendText: jest.fn() };
    conversationFactory = jest.fn().mockReturnValue(conversation);

    program = new Command();

    cli = createCli({
      program,
      fsReadFileSync,
      fsAccessSync: jest.fn(),
      webMessengerSessionFactory,
      conversationFactory,
      processExitOverride: () => {
        throw new Error('force app to exit');
      },
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

    await cli([
      ...['node', '/path/to/cli'],
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
      expect.any(String),
    );
  });

  test('Test-Script session config not necessary if session config args provided', async () => {
    fsReadFileSync.mockReturnValue(`
scenarios:
  exampleName:
    - say: "hi"
`);

    await cli([
      ...['node', '/path/to/cli'],
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
      expect.any(String),
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

    await cli([...['node', '/path/to/cli'], ...['/test/path']]);

    expect(webMessengerSessionFactory).toHaveBeenCalledWith(
      {
        deploymentId: 'test-deployment-id-3',
        region: 'test-region-3',
        origin: 'test-origin-3',
      },
      expect.any(String),
    );
  });

  test.todo('stepTimeoutInSeconds in config passed to wait step', async () => {
    fsReadFileSync.mockReturnValue(`
config:
  deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  region: xxxx.pure.cloud
  stepTimeoutInSeconds: 123
scenarios:
  exampleName:
    - say: "hi"
`);

    await cli([
      ...['node', '/path/to/cli'],
      ...['--deployment-id', 'test-deployment-id'],
      ...['--region', 'test-region'],
      ...['--origin', 'test-origin'],
      ...['/test/path'],
    ]);

    expect(webMessengerSessionFactory).toHaveBeenCalledWith({
      deploymentId: 'test-deployment-id',
      region: 'test-region',
      origin: 'test-origin',
    });
  });
});
