import formatjs, { type ExtractCLIOptions } from "@formatjs/cli-lib";
import { DEFAULT_ID_INTERPOLATION_PATTERN } from "babel-plugin-formatjs";
import dejarun from "dejarun";
import fg from "fast-glob";
import type { ParseArgsOptionsConfig } from "node:util";
import { LANG_DIR, UNIVERSAL_LOCALE_EXTRACTED } from "../config.ts";
import { type Options } from "../options.ts";

export const EXTRACT_IGNORE_GLOBS = ["**/*.d.ts"];

export interface ExtractOptions extends Options, ExtractCLIOptions {
  path?: string[];
}

export const parseArgsOptionsConfig: ParseArgsOptionsConfig = {
  "out-file": {
    type: "string",
    default: `${LANG_DIR}/${UNIVERSAL_LOCALE_EXTRACTED}.json`,
  },
  path: {
    type: "string",
    default: ["app"],
    multiple: true,
  },
};

const withDefaultOptions = ({ ...options }: ExtractOptions) => {
  options.outFile ??= parseArgsOptionsConfig["out-file"].default as string;
  if ((options.path?.length ?? 0) === 0) {
    options.path = parseArgsOptionsConfig.path.default as string[];
  }

  return options;
};

export async function extract_raw(_options: ExtractOptions) {
  const options = withDefaultOptions(_options);

  await formatjs.extractAndWrite(
    await fg(
      options.path!.map((path) => `${path}/**/*.{j,t}s{,x}`),
      { ignore: EXTRACT_IGNORE_GLOBS },
    ),
    {
      idInterpolationPattern: DEFAULT_ID_INTERPOLATION_PATTERN,
      flatten: true,
      preserveWhitespace: true,
      ...options,
    },
  );
}

export const extract = async (_options: ExtractOptions) => {
  const options = withDefaultOptions(_options);

  await dejarun("formatjs-tools extract", async () => extract_raw(options), {
    inputs: options.path,
    outputs: [options.outFile!],
    clean: options.clean,
    logo: false,
  });
};
