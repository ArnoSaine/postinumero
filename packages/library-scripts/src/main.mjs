#!/usr/bin/env node

import init from './init.mjs';
import scripts from './scripts.mjs';

const [command, ...args] = process.argv.slice(2);

if (command === 'init') {
  init(...args);
} else {
  scripts(command, ...args);
}
