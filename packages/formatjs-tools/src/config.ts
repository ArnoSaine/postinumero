import config from "@postinumero/config/file/global/awaited";
import { ensureDir } from "fs-extra/esm";
import { memoize } from "lodash-es";
import { readdir } from "node:fs/promises";
import path from "node:path";
import {
  type ListOrFilter,
  emptyArrayFallback,
  filterBy,
} from "./utils/config.ts";
import { reverseParentDomains, reverseSubDomains } from "./utils/domain.ts";
import { isLeafLocale, isLocale } from "./utils/locale.ts";
import { isLeaf, isPathname } from "./utils/string.ts";

export const toLangDirPath = (locale: string) =>
  path.join(LANG_DIR, `${locale}.json`);

export const LANG_DIR = "lang";
export const HIDDEN_LANG_DIR = ".lang";
export const AGGREGATED_DIR = path.join(HIDDEN_LANG_DIR, "aggregated");
export const COLLECTED_DIR = path.join(HIDDEN_LANG_DIR, "collected");
export const MERGED_DIR = path.join(HIDDEN_LANG_DIR, "merged");
export const DEFAULT_COMPILED_DIR = path.join(HIDDEN_LANG_DIR, "compiled");
export const CONFIG_FILE = path.join(HIDDEN_LANG_DIR, "config.json");
export const LOCALE_SEPARATOR = ":";
export const ENVIRONMENT_SEPARATOR = ".";
export const UNIVERSAL_LOCALE_DEFAULT = ".default";
export const UNIVERSAL_LOCALE_EXTRACTED = ".extracted";
export const UNIVERSAL_LOCALES = [
  UNIVERSAL_LOCALE_EXTRACTED,
  UNIVERSAL_LOCALE_DEFAULT,
];
export const UNIVERSAL_LOCALE_FILES = UNIVERSAL_LOCALES.map(toLangDirPath);

export const isEnvironment = isPathname;

export type Locale = string;
export type ConfigEnvironment =
  | string
  | {
      name: string;
      locales: ConfigLocales;
    };
export type ConfigLocales = ListOrFilter<Locale>;
export type ConfigEnvironments = ListOrFilter<ConfigEnvironment>;

export interface Config {
  locales?: ConfigLocales;
  environments?: ConfigEnvironments;
}

export const getConfig = memoize(async function getConfig() {
  await ensureDir(LANG_DIR);
  const langDirContents = await getLangDirContents(LANG_DIR);
  const langDirEnvironments = langDirContents
    .filter(({ environment }) => environment)
    .map(({ environment }) => environment!)
    // Remove "com.example", if "com.example.production" exists
    .filter(isLeaf(ENVIRONMENT_SEPARATOR));

  const langDirBaseEnvironmentLocales = langDirContents
    .filter(({ environment, locale }) => !environment && locale)
    .map(({ locale }) => locale!)
    // Remove "en", if "en-US" exists
    .filter(isLeafLocale);

  const getLangDirLocalesByEnvironment = (environment: string) =>
    langDirContents
      .filter((entry) => entry.environment === environment && entry.locale)
      .map(({ locale }) => locale!);

  const filteredBaseEnvironmentLocales = filterBy(
    langDirBaseEnvironmentLocales,
    config.locales,
  );

  const environments = filterBy(langDirEnvironments, config.environments).map(
    (environment) =>
      typeof environment === "object"
        ? {
            name: environment.name,
            locales: filterBy(
              emptyArrayFallback(
                getLangDirLocalesByEnvironment(environment.name),
                filteredBaseEnvironmentLocales,
              ),
              environment.locales,
            ),
          }
        : // If environment is a string, use the filtered locales from the base
          // Example: "com.example" → { name: "com.example", locales: ["en", "fi"] }
          {
            name: environment,
            locales: filteredBaseEnvironmentLocales,
          },
  );

  return {
    locales: filteredBaseEnvironmentLocales,
    environments,
  };
});

const getLangDirContents = async (dir: string) =>
  (await readdir(dir))
    .map(path.parse)
    // Pathnames without extension
    .map(({ name }) => name)
    .map((name) => name.split(LOCALE_SEPARATOR) as [string | undefined, string])
    .map(([environment, locale]) => {
      if (!locale) {
        locale = environment!;
        environment = undefined;
      }

      return {
        environment,
        locale: isLocale(locale) ? locale : undefined,
      };
    });

// "com.example.test" --> ["test", "example.test", "com.example.test"]
export const subEnvironments = reverseSubDomains;

// "com.example.test" --> ["com", "com.example", "com.example.test"]
export const parentEnvironments = reverseParentDomains;

// "com.example.test" --> ["test", "example.test", "com", "com.example", "com.example.test"]
export const inheritedEnvironments = (environment: string) => [
  ...subEnvironments(environment).slice(0, -1),
  ...parentEnvironments(environment),
];
