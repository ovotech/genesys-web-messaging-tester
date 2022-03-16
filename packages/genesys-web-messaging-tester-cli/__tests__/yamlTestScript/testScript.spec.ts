import { Cli, createCli } from '../../src/cli';
import { accessSync, readFileSync } from 'fs';
import { Command } from 'commander';

describe('Test-script read from disk', () => {
  let fsReadFileSync: jest.MockedFunction<typeof readFileSync>;
  let fsAccessSync: jest.MockedFunction<typeof accessSync>;

  let cli: Cli;

  beforeEach(() => {
    fsReadFileSync = jest.fn();
    fsAccessSync = jest.fn();

    cli = createCli({
      program: new Command(),
      fsReadFileSync,
      fsAccessSync,
      webMessengerSessionFactory() {
        throw Error('Not implemented');
      },
      conversationFactory() {
        throw Error('Not implemented');
      },
      processExitOverride() {
        throw new Error('force app to exit');
      },
    });
  });

  test('path of test-script in argument used as file path', async () => {
    fsReadFileSync.mockImplementation(() => {
      throw new Error('test error');
    });

    await expect(cli([...['node', '/path/to/cli'], ...['/test/path.yaml']])).rejects.toBeDefined();

    expect(fsReadFileSync).toHaveBeenCalledWith('/test/path.yaml', 'utf8');
  });

  test('path of test-script in argument validated', async () => {
    fsAccessSync.mockImplementation(() => {
      throw new Error('test error');
    });

    await expect(cli([...['node', '/path/to/cli'], ...['/test/path.yaml']])).rejects.toBeDefined();

    expect(fsAccessSync).toHaveBeenCalledWith('/test/path.yaml', expect.any(Number));
  });
});
