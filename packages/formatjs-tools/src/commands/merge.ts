import dejarun from "dejarun";
import {
  AGGREGATED_DIR,
  COLLECTED_DIR,
  getConfig,
  LOCALE_SEPARATOR,
  MERGED_DIR,
} from "../config.ts";
import { mergeJsonFiles } from "../files.ts";
import { defaults, type Options } from "../options.ts";

export interface MergeOptions extends Options {}

export const merge_raw = async ({
  logLevel = defaults.logLevel,
}: MergeOptions = {}) => {
  const config = await getConfig();

  const files = [
    { name: undefined, locales: config.locales },
    ...config.environments,
  ].map(({ name, locales }) => ({
    name,
    locales: locales.map((locale) => ({
      locale,
      files: [AGGREGATED_DIR, COLLECTED_DIR]
        .map(
          name
            ? (dir) => `${dir}/${name}${LOCALE_SEPARATOR}${locale}.json`
            : (dir) => `${dir}/${locale}.json`,
        )
        .map((file) => ({
          exists: true,
          path: file,
        })),
    })),
  }));

  await mergeJsonFiles(MERGED_DIR, files);
};

export const merge = async (options?: MergeOptions) => {
  await dejarun("formatjs-tools merge", () => merge_raw(options), {
    inputs: [AGGREGATED_DIR, COLLECTED_DIR],
    outputs: [MERGED_DIR],
    dependencies: [await getConfig()],
    clean: options?.clean,
    logo: false,
  });
};
