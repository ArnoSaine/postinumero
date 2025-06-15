import { DEFAULT_INTL_CONFIG } from "@formatjs/intl";
import { uniq } from "lodash-es";
import type { ResolvedIntlConfig } from "react-intl";
import { useMatches, type UIMatch } from "react-router";
import type { Environment } from "./config.ts";
import { CONFIG } from "./config.ts";
import { createOptions } from "./options/create.ts";
import type { clientLoader } from "./routes/options.tsx";

export const langDirModules = import.meta.env
  ? import.meta.glob<ResolvedIntlConfig["messages"]>(
      "/.lang/compiled/*.json",
      // Named exports are not supported. Some message IDs are not valid identifiers. Example: "f9g+9J"
      { import: "default" },
    )
  : (new Proxy(
      {},
      {
        get: (_target, prop: string) => async () =>
          (
            await import(/* @vite-ignore */ `${process.cwd()}/${prop}`, {
              with: { type: "json" },
            })
          ).default,
      },
    ) as Record<string, () => Promise<ResolvedIntlConfig["messages"]>>);

const getLangDirModulePath = (locale: string, environment: Environment) =>
  `.lang/compiled/${[environment, locale].filter(Boolean).join(":")}.json`;

export const langDirContents = Object.keys(langDirModules).map((key) => {
  let [environment, locale] = key.split("/").at(-1)!.split(":") as [
    string | null,
    string,
  ];

  if (!locale) {
    locale = environment!;
    environment = null;
  }

  locale = locale.replace(/\.json$/, "");

  return { environment, locale };
});

export const getLangDirLocalesByEnvironment = (environment: Environment) =>
  langDirContents
    .filter((entry) => entry.environment === environment)
    .map(({ locale }) => locale);

export const environmentNames = uniq(
  langDirContents
    .filter(({ environment }) => environment)
    .map(({ environment }) => environment!),
);

export const environments = environmentNames.map((name) => ({
  name,
  locales: getLangDirLocalesByEnvironment(name),
}));

export const locales = langDirContents
  .filter(({ environment, locale }) => !environment && locale)
  .map(({ locale }) => locale!);

export function getMessages(locale: string, environment: Environment) {
  const langDirModulePath = getLangDirModulePath(locale, environment);
  const importLangDirModule = langDirModules[langDirModulePath];
  return importLangDirModule();
}

const findMatch = (matches: UIMatch[]) =>
  (matches as UIMatch<Awaited<ReturnType<typeof clientLoader>>>[]).find(
    (match) => match.id === CONFIG.route.id,
  );

export const useOptions = () => getOptionsFromMatches(useMatches());

export const getOptionsFromMatches = (matches: UIMatch[]) =>
  findMatch(matches)?.data ?? defaultOptions;

const defaultOptions = await createOptions();

// Set default locale to one of the available locales
DEFAULT_INTL_CONFIG.defaultLocale = defaultOptions.intlConfig.locale;
// Set default messages by the default locale
DEFAULT_INTL_CONFIG.messages = defaultOptions.intlConfig.messages;
