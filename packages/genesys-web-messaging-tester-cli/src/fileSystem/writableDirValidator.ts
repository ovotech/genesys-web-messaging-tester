import fs, { accessSync } from 'fs';
import commander from 'commander';

export function writableDirValidator(fsAccessSync: typeof accessSync) {
  return function (directoryPath: string): string {
    try {
      fsAccessSync(directoryPath, fs.constants.W_OK);
    } catch (error) {
      throw new commander.InvalidOptionArgumentError(
        `Directory '${directoryPath}' is not writable`,
      );
    }
    return directoryPath;
  };
}
