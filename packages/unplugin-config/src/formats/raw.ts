import { FormatOptions } from ".";
import sourceHandlers, { SourceName } from "../plugin/sourceHandlers";
import { Options } from "../types";

export default async function raw(options: Options, { search }: FormatOptions) {
  const searchParams = new URLSearchParams(search);
  if (searchParams.size) {
    options.sources = [];
    for (const [name, value] of searchParams) {
      if (name in sourceHandlers) {
        options.sources.push([name as SourceName, value]);
      }
    }
  }

  const resolvedSources = await Promise.all(
    options.sources!.map(([name, value]) => sourceHandlers[name](value)),
  );

  return `import { flow, map, merge } from "lodash-es";

export default [${resolvedSources}];`;
}
