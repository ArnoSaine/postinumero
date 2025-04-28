import chalk from "chalk";
import dejarun from "dejarun";
import {
  COLLECTED_DIR,
  getConfig,
  inheritedEnvironments,
  LANG_DIR,
  LOCALE_SEPARATOR,
  toLangDirPath,
  UNIVERSAL_LOCALES,
} from "../config.ts";
import { formatFiles } from "../debug.ts";
import { exists, mergeJsonFiles } from "../files.ts";
import { defaults, type Options } from "../options.ts";
import { asyncMap } from "../utils/array.ts";
import { baseLocales } from "../utils/locale.ts";
import { each } from "../utils/tagged-template.ts";

export interface CollectOptions extends Options {}

export async function collect_raw({
  logLevel = defaults.logLevel,
}: CollectOptions = {}) {
  const config = await getConfig();

  const collectedFiles = await asyncMap(
    [{ name: undefined, locales: config.locales }, ...config.environments],
    async ({ name, locales }) => ({
      name,
      locales: await asyncMap(locales, async (locale) => ({
        locale,
        files: await asyncMap(
          (name ? [undefined, ...inheritedEnvironments(name)] : [name])
            .flatMap((environment) =>
              [
                ...(environment ? UNIVERSAL_LOCALES : []),
                ...baseLocales(locale),
              ].map((locale) =>
                environment
                  ? `${environment}${LOCALE_SEPARATOR}${locale}`
                  : locale,
              ),
            )
            .map(toLangDirPath),
          exists,
        ),
      })),
    }),
  );

  const showMissingFiles = logLevel === "debug";

  if (logLevel === "debug" || logLevel === "info") {
    console.log(
      `Collect messages:${each`
  ${collectedFiles.map(
    ({ name = "(base)", locales }) =>
      `${chalk.cyan(name)}${chalk.green(each`
    ${locales.map(
      ({ locale, files }) =>
        `${chalk.yellow(locale)}${chalk.green(each`
      ${formatFiles(files, showMissingFiles)}`)}`,
    )}`)}`,
  )}`}`,
    );
  }

  await mergeJsonFiles(COLLECTED_DIR, collectedFiles);
}

export const collect = async (options?: CollectOptions) => {
  await dejarun("formatjs-tools collect", () => collect_raw(options), {
    inputs: [LANG_DIR],
    outputs: [COLLECTED_DIR],
    dependencies: [await getConfig()],
    clean: options?.clean,
    logo: false,
  });
};
