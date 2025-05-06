#!/usr/bin/env node

import { mapKeys } from "lodash-es";
import { parseArgs } from "node:util";
import invariant from "tiny-invariant";
import { aggregate, type AggregateOptions } from "../commands/aggregate.ts";
import { collect, type CollectOptions } from "../commands/collect.ts";
import {
  compile,
  parseArgsOptionsConfig as compileParseArgsOptionsConfig,
  type CompileOptions,
} from "../commands/compile.ts";
import { config, type ConfigOptions } from "../commands/config.ts";
import {
  extract,
  parseArgsOptionsConfig as extractParseArgsOptionsConfig,
  type ExtractOptions,
} from "../commands/extract.ts";
import { merge, type MergeOptions } from "../commands/merge.ts";
import {
  processMessages,
  type ProcessMessagesOptions,
} from "../commands/process-messages.ts";
import { parseArgsConfig } from "../options.ts";
import { argsValuesToOptions } from "../utils/node/util.ts";

const { positionals } = parseArgs({
  strict: false,
});

const [command] = positionals;

const commands = {
  async config() {
    const { values } = parseArgs(parseArgsConfig);
    await config(argsValuesToOptions(values) as ConfigOptions);
  },
  async extract() {
    const { values } = parseArgs({
      ...parseArgsConfig,
      options: {
        ...parseArgsConfig.options,
        ...extractParseArgsOptionsConfig,
      },
    });
    await extract(argsValuesToOptions(values) as ExtractOptions);
  },
  async aggregate() {
    const { values } = parseArgs(parseArgsConfig);
    await aggregate(argsValuesToOptions(values) as AggregateOptions);
  },
  async collect() {
    const { values } = parseArgs(parseArgsConfig);
    await collect(argsValuesToOptions(values) as CollectOptions);
  },
  // TODO: compare aggregated to collected
  // async validate() {},
  async merge() {
    const { values } = parseArgs(parseArgsConfig);
    await merge(argsValuesToOptions(values) as MergeOptions);
  },
  async compile() {
    const { values } = parseArgs({
      ...parseArgsConfig,
      options: {
        ...parseArgsConfig.options,
        ...compileParseArgsOptionsConfig,
      },
    });
    await compile(argsValuesToOptions(values) as CompileOptions);
  },
  "process-messages": async () => {
    const { values } = parseArgs({
      ...parseArgsConfig,
      options: {
        ...parseArgsConfig.options,
        ...mapKeys(extractParseArgsOptionsConfig, (_, key) => `extract.${key}`),
        ...mapKeys(compileParseArgsOptionsConfig, (_, key) => `compile.${key}`),
      },
    });
    await processMessages(
      argsValuesToOptions(values) as unknown as ProcessMessagesOptions,
    );
  },
};

invariant(
  command in commands,
  `Command "${command}" not found. Available commands: ${Object.keys(
    commands,
  ).join(", ")}`,
);

commands[command as keyof typeof commands]();
