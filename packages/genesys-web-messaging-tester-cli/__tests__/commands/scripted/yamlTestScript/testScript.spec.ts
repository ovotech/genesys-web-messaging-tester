import { accessSync, readFileSync } from 'fs';
import { Command } from 'commander';
import { createCli } from '../../../../src/createCli';

describe('Test-script read from disk', () => {
  let fsReadFileSync: jest.MockedFunction<typeof readFileSync>;
  let fsAccessSync: jest.MockedFunction<typeof accessSync>;

  let cli: Command;

  beforeEach(() => {
    fsReadFileSync = jest.fn();
    fsAccessSync = jest.fn();

    const cliCommand = new Command().exitOverride(() => {
      throw new Error('CLI Command errored');
    });

    const scenarioTestCommand = new Command().exitOverride(() => {
      throw new Error('Scenario Test Command errored');
    });

    cli = createCli(cliCommand, {
      command: scenarioTestCommand,
      fsReadFileSync,
      fsAccessSync,
      webMessengerSessionFactory() {
        throw Error('Not implemented');
      },
      conversationFactory() {
        throw Error('Not implemented');
      },
    });
  });

  test('path of test-script in argument used as file path', async () => {
    fsReadFileSync.mockImplementation(() => {
      throw new Error('test error');
    });

    await expect(
      cli.parseAsync([...['node', '/path/to/cli'], ...['scripted', '/test/path.yaml']]),
    ).rejects.toBeDefined();

    expect(fsReadFileSync).toHaveBeenCalledWith('/test/path.yaml', 'utf8');
  });

  test('path of test-script in argument validated', async () => {
    fsAccessSync.mockImplementation(() => {
      throw new Error('test error');
    });

    await expect(
      cli.parseAsync([...['node', '/path/to/cli'], ...['scripted', '/test/path.yaml']]),
    ).rejects.toBeDefined();

    expect(fsAccessSync).toHaveBeenCalledWith('/test/path.yaml', expect.any(Number));
  });
});
