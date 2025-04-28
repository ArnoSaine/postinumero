import formatjs from "@formatjs/cli-lib";
import type { PseudoLocale } from "@formatjs/cli-lib/src/compile.js";
import dejarun from "dejarun";
import { emptyDir, writeJson } from "fs-extra/esm";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ParseArgsOptionsConfig } from "node:util";
import {
  DEFAULT_COMPILED_DIR,
  getConfig,
  LOCALE_SEPARATOR,
  MERGED_DIR,
} from "../config.ts";
import { defaults, type Options } from "../options.ts";
import { asyncMap } from "../utils/array.ts";
import { hashValue, type HashValueOptions } from "../utils/node/crypto.ts";

export const PSEUDO_LOCALES = [
  "en-XA",
  "en-XB",
  "xx-AC",
  "xx-HA",
  "xx-LS",
] as PseudoLocale[];

export interface CompileOptions extends Options {
  outDir?: string;
  hash?: HashValueOptions | true;
}

export const parseArgsOptionsConfig: ParseArgsOptionsConfig = {
  "out-dir": {
    type: "string",
    default: DEFAULT_COMPILED_DIR,
  },
  hash: {
    type: "boolean",
  },
  "hash.algorithm": {
    type: "string",
  },
  "hash.length": {
    type: "string",
  },
  "hash.encoding": {
    type: "string",
  },
};

export const compile_raw = async ({
  outDir = parseArgsOptionsConfig["out-dir"].default as string,
  hash,
  logLevel = defaults.logLevel,
}: CompileOptions = {}) => {
  const config = await getConfig();
  const files = [
    { name: undefined, locales: config.locales },
    ...config.environments,
  ].map(({ name, locales }) => ({
    name,
    locales: locales.map((locale) => ({
      locale,
      files: [
        name
          ? `${MERGED_DIR}/${name}${LOCALE_SEPARATOR}${locale}.json`
          : `${MERGED_DIR}/${locale}.json`,
      ],
    })),
  }));

  const data = await asyncMap(files, async ({ name, locales }) => ({
    name,
    locales: await asyncMap(locales, async ({ locale, files }) => {
      const json = await formatjs.compile(files, {
        pseudoLocale: PSEUDO_LOCALES.includes(locale as PseudoLocale)
          ? (locale as PseudoLocale)
          : undefined,
        ast: true,
        //...options,
      });

      return {
        locale,
        json,
        digest: hash ? hashValue(json, hash) : undefined,
      };
    }),
  }));

  await emptyDir(outDir);

  await asyncMap(data, async ({ name, locales }) =>
    asyncMap(locales, ({ locale, json, digest }) =>
      writeFile(
        join(
          outDir,
          `${name ? `${name}${LOCALE_SEPARATOR}${locale}` : locale}${digest ? `-${digest}` : ""}.json`,
        ),
        json,
      ),
    ),
  );

  if (hash) {
    await writeJson(
      join(outDir, "manifest.json"),
      Object.fromEntries(
        data.flatMap(({ name, locales }) =>
          locales.map(({ locale, digest }) => [
            name ? `${name}${LOCALE_SEPARATOR}${locale}` : locale,
            digest,
          ]),
        ),
      ),
      { spaces: 2 },
    );
  }
};

export const compile = async (options?: CompileOptions) => {
  await dejarun("formatjs-tools compile", () => compile_raw(options), {
    inputs: [MERGED_DIR],
    outputs: [
      options?.outDir ?? (parseArgsOptionsConfig["out-dir"].default as string),
    ],
    dependencies: [await getConfig(), options?.hash],
    clean: options?.clean,
    logo: false,
  });
};
