#!/usr/bin/env node

import { createCli } from './createCli';
import { CommandExpectedlyFailedError } from './commands/CommandExpectedlyFailedError';

createCli()
  .parseAsync(process.argv)
  .then(() => process.exit(0))
  .catch((error) => {
    if (error && !(error instanceof CommandExpectedlyFailedError)) {
      console.error(error);
    }
    process.exit(1);
  });
