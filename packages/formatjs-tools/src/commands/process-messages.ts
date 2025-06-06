import type { Options } from "../options.ts";
import { aggregate, type AggregateOptions } from "./aggregate.ts";
import { collect, type CollectOptions } from "./collect.ts";
import { compile, type CompileOptions } from "./compile.ts";
import { config, type ConfigOptions } from "./config.ts";
import { extract, type ExtractOptions } from "./extract.ts";
import { merge, type MergeOptions } from "./merge.ts";

export interface ProcessMessagesOptions extends Options {
  config?: ConfigOptions;
  extract?: ExtractOptions;
  aggregate?: AggregateOptions;
  collect?: CollectOptions;
  merge?: MergeOptions;
  compile?: CompileOptions;
}

export async function processMessages({
  config: _config,
  extract: _extract,
  aggregate: _aggregate,
  collect: _collect,
  merge: _merge,
  compile: _compile,
  ...options
}: ProcessMessagesOptions = {}) {
  await config({ ...options, ..._config });
  await extract({ ...options, ..._extract });
  await aggregate({ ...options, ..._aggregate });
  await collect({ ...options, ..._collect });
  await merge({ ...options, ..._merge });
  await compile({ ...options, ..._compile });
}
