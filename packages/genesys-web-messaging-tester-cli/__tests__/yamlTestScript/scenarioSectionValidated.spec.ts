import { Cli, createCli } from '../../src/cli';
import { readFileSync } from 'fs';
import { Command } from 'commander';
import stripAnsi from 'strip-ansi';

describe('Scenario Section Validated', () => {
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

  test('config section is optional', async () => {
    fsReadFileSync.mockReturnValue(`
scenarios:
  scenario:
    - say: hi from scenario
`);
    await expect(
      cli([
        ...['node', '/path/to/cli'],
        ...['--deployment-id', 'test-deployment-id'],
        ...['--region', 'test-region'],
        ...['test-path'],
      ]),
    ).resolves.toBeUndefined();

    expect(capturedOutput.errOut.map(stripAnsi)).toStrictEqual([]);
  });

  test('scenarios section is required', async () => {
    fsReadFileSync.mockReturnValue(`
config:
  deploymentId: xx
  region: xx
`);
    await expect(
      cli([...['node', '/path/to/cli'], ...['test-path']]),
    ).rejects.toBeDefined();

    expect(capturedOutput.errOut.map(stripAnsi)).toStrictEqual(['"scenarios" is required']);
  });

  test('scenario step can only contain one element', async () => {
    fsReadFileSync.mockReturnValue(`
config:
  deploymentId: xx
  region: xx
scenarios:
  scenario-name:
    - say: hi from scenario
      waitForReplyContaining: hello
`);
    await expect(
      cli([...['node', '/path/to/cli'], ...['test-path']]),
    ).rejects.toBeDefined();

    expect(capturedOutput.errOut.map(stripAnsi)).toStrictEqual([
      '"scenarios.scenario-name[0]" must have 1 key',
    ]);
  });

  test("scenario step can only contain 'say' or 'waitForReplyContaining'", async () => {
    fsReadFileSync.mockReturnValue(`
config:
  deploymentId: xx
  region: xx
scenarios:
  scenario-name:
    - testing: 123
`);
    await expect(
      cli([...['node', '/path/to/cli'], ...['test-path']]),
    ).rejects.toBeDefined();

    expect(capturedOutput.errOut.map(stripAnsi)).toStrictEqual([
      '"scenarios.scenario-name[0].testing" is not allowed',
    ]);
  });
});
