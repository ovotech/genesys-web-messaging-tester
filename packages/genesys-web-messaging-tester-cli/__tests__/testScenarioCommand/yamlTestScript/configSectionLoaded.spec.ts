import { ScenarioTestCommandDependencies } from '../../../src/commands/scenario/createScenarioTestCommand';
import { readFileSync } from 'fs';
import { Command } from 'commander';
import { createCli } from '../../../src/createCli';

describe('Session Config', () => {
  let fsReadFileSync: jest.MockedFunction<typeof readFileSync>;

  let webMessengerSessionFactory: jest.Mocked<
    ScenarioTestCommandDependencies['webMessengerSessionFactory']
  >;
  let conversationFactory: jest.Mocked<ScenarioTestCommandDependencies['conversationFactory']>;

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

    cli = createCli(cliCommand, {
      command: scenarioTestCommand,
      fsReadFileSync,
      fsAccessSync: jest.fn(),
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
      'test-scenario',
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

  test('Test-Script session config not necessary if session config args provided', async () => {
    fsReadFileSync.mockReturnValue(`
scenarios:
  exampleName:
    - say: "hi"
`);

    await cli.parseAsync([
      ...['node', '/path/to/cli'],
      'test-scenario',
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

    await cli.parseAsync([...['node', '/path/to/cli'], ...['test-scenario', '/test/path']]);

    expect(webMessengerSessionFactory).toHaveBeenCalledWith({
      deploymentId: 'test-deployment-id-3',
      region: 'test-region-3',
      origin: 'test-origin-3',
    });
  });
});
