import { Cli, createCli } from '../../src/cli';
import { readFileSync } from 'fs';
import { Command } from 'commander';
import stripAnsi from 'strip-ansi';

describe('Session Config Validated', () => {
  let capturedOutput: {
    errOut: string[];
  };

  let program: Command;
  let fsReadFileSync: jest.MockedFunction<typeof readFileSync>;

  let cli: Cli;

  beforeEach(() => {
    fsReadFileSync = jest.fn();

    const webMessengerSession = { on: jest.fn(), close: jest.fn() };
    const conversation = { waitForConversationToStart: jest.fn(), sendText: jest.fn() };

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
      fsAccessSync: jest.fn(),
      webMessengerSessionFactory: jest.fn().mockReturnValue(webMessengerSession),
      conversationFactory: jest.fn().mockReturnValue(conversation),
      processExitOverride: () => {
        throw new Error('force app to exit');
      },
    });
  });

  test.each([
    [
      {
        expectedError: '"region" is required',
        configSection: ['deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'],
      },
    ],
    [
      {
        expectedError: '"config.region" must be a string',
        configSection: ['deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'region: 1'],
      },
    ],
    [{ expectedError: '"deploymentId" is required', configSection: ['region: xx'] }],
    [
      {
        expectedError: '"config.deploymentId" must be a string',
        configSection: ['deploymentId: 1', 'region: xx'],
      },
    ],
    [
      {
        expectedError: '"config.origin" must be a string',
        configSection: ['deploymentId: xx', 'region: xx', 'origin: 1'],
      },
    ],
  ])("Config from YAML validated: '%s'", async ({ expectedError, configSection }) => {
    fsReadFileSync.mockReturnValue(`
config:
  ${configSection.join('\n  ')}
scenarios:
  scenario:
    - say: hi from scenario
`);
    await expect(
      cli([...['node', '/path/to/cli'], ...['--test-script-path', 'test-path']]),
    ).rejects.toBeDefined();

    expect(capturedOutput.errOut.map(stripAnsi)).toStrictEqual([expectedError]);
  });

  test.each([
    [
      {
        expectedError: '"region" is required',
        args: ['--deployment-id', 'xx'],
      },
    ],
    [
      {
        expectedError: '"deploymentId" is required',
        args: ['--region', 'xx'],
      },
    ],
  ])("Config from CLI args validation: '%s'", async ({ expectedError, args }) => {
    fsReadFileSync.mockReturnValue(`
scenarios:
  scenario:
    - say: hi from scenario
`);
    await expect(
      cli([...['node', '/path/to/cli'], ...args, ...['--test-script-path', 'test-path']]),
    ).rejects.toBeDefined();

    expect(capturedOutput.errOut.map(stripAnsi)).toStrictEqual([expectedError]);
  });
});
