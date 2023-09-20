#!/usr/bin/env node

import { strict as assert } from 'assert';
import init from './init.js';
import build from './build.js';
import watch from './watch.js';

const [commandName, ...args] = process.argv.slice(2);
const commands = { init, build, watch };
const command = commands[commandName];

assert(command, `Received command "${commandName}" exists`);

command(...args);
