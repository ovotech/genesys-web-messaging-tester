#!/usr/bin/env node

import { createCli } from './createCli';

createCli()
  .parseAsync(process.argv)
  .then(() => process.exit(0))
  .catch((error) => {
    if (error) {
      console.error(error);
    }
    process.exit(1);
  });
