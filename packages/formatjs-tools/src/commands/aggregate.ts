import chalk from "chalk";
import dejarun from "dejarun";
import { identity, uniq } from "lodash-es";
import { join } from "node:path";
import {
  AGGREGATED_DIR,
  getConfig,
  inheritedEnvironments,
  LOCALE_SEPARATOR,
  toLangDirPath,
  UNIVERSAL_LOCALE_FILES,
  UNIVERSAL_LOCALES,
} from "../config.ts";
import { formatFiles } from "../debug.ts";
import { getLangDependencyPaths } from "../dependencies.ts";
import { exists, mergeJsonFiles, type EnvironmentFiles } from "../files.ts";
import { defaults, type Options } from "../options.ts";
import { asyncMap, flatMap, map } from "../utils/array.ts";
import { baseLocales } from "../utils/locale.ts";
import { each } from "../utils/tagged-template.ts";

const baseAndUniversalLocales = (locale: string) => [
  ...UNIVERSAL_LOCALES,
  ...baseLocales(locale),
];

const toDependencyLangDirPaths = (locales: string[]) => (dep: string) =>
  locales.map(toLangDirPath).map((file) => join(dep, file));

interface Environment {
  name: string | undefined;
  locales: string[];
}

export const getAggregatedFiles = async (environments: Environment[]) => {
  const dependencyPaths = await getLangDependencyPaths();

  return asyncMap(environments, async ({ name, locales }) => ({
    name,
    locales: await asyncMap(locales, async (locale) => ({
      locale,
      files: await asyncMap(
        [
          ...(name
            ? [
                identity<string>,
                ...inheritedEnvironments(name).map(
                  (environment) => (locale: string) =>
                    `${environment}${LOCALE_SEPARATOR}${locale}`,
                ),
              ]
            : [identity<string>]
          )
            .map(map(baseAndUniversalLocales(locale)))
            .map(toDependencyLangDirPaths)
            .flatMap(flatMap(dependencyPaths)),
          ...UNIVERSAL_LOCALE_FILES,
        ],
        exists,
      ),
    })),
  }));
};

export interface AggregateOptions extends Options {}

export async function aggregate_raw(
  aggregatedFiles: EnvironmentFiles[],
  { logLevel = defaults.logLevel }: AggregateOptions = {},
) {
  const showMissingFiles = logLevel === "debug";

  if (logLevel === "debug" || logLevel === "info") {
    console.log(
      `Aggregated messages:${each`
  ${aggregatedFiles.map(
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

  await mergeJsonFiles(AGGREGATED_DIR, aggregatedFiles);
}

export const aggregate = async (options?: AggregateOptions) => {
  const config = await getConfig();

  const environments = [
    { name: undefined, locales: config.locales },
    ...config.environments,
  ];

  const aggregatedFiles = await getAggregatedFiles(environments);
  const inputs = uniq(
    aggregatedFiles.flatMap(({ locales }) =>
      locales.flatMap(({ files }) => files.map(({ path }) => path)),
    ),
  );

  await dejarun(
    "formatjs-tools aggregate",
    () => aggregate_raw(aggregatedFiles, options),
    {
      inputs,
      outputs: [AGGREGATED_DIR],
      dependencies: [config, aggregatedFiles],
      clean: options?.clean,
      logo: false,
    },
  );
};
