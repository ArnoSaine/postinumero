import type { IntlConfig, ResolvedIntlConfig } from "@formatjs/intl";
import { DEFAULT_INTL_CONFIG } from "react-intl/src/utils.js";
import invariant from "tiny-invariant";
import { type Options } from "../options.ts";
import { match } from "../utils/@formatjs/intl-localematcher.ts";

export async function getIntlConfig({
  requestedLocales,
  environment,
}: Options): Promise<
  IntlConfig & { messages: ResolvedIntlConfig["messages"] }
> {
  const availableLocales =
    (environment
      ? environments.find((env) => env.name === environment)?.locales
      : undefined) ?? locales;

  const matchingLocale = match(
    requestedLocales,
    availableLocales,
    DEFAULT_INTL_CONFIG.defaultLocale,
  );

  return {
    locale: matchingLocale,
    messages: await getMessages(matchingLocale, environment),
  };
}

export const getMessages = (locale: string, environment?: string | null) => {
  const importLangDirModule =
    langDirModules[
      `.lang/compiled/${[environment, locale].filter(Boolean).join(":")}.json`
    ];

  invariant(
    importLangDirModule,
    `No messages found for locale "${locale}"${
      environment ? ` and environment "${environment}"` : ""
    }`,
  );

  return importLangDirModule();
};

export const getLangDirLocalesByEnvironment = (environment?: string) =>
  langDirContents
    .filter((entry) => entry.environment === environment)
    .map(({ locale }) => locale);

export const langDirModules = import.meta.glob<ResolvedIntlConfig["messages"]>(
  "/.lang/compiled/*.json",
  // Named exports are not supported. Some message IDs are not valid identifiers. Example: "f9g+9J"
  { import: "default" },
);

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

export const langDirEnvironments = langDirContents
  .filter(({ environment }) => environment)
  .map(({ environment }) => environment!);

export const environments = langDirEnvironments.map((name) => ({
  name,
  locales: getLangDirLocalesByEnvironment(name),
}));

export const locales = langDirContents
  .filter(({ environment, locale }) => !environment && locale)
  .map(({ locale }) => locale!);

export const defaultIntlConfig = await getIntlConfig({
  requestedLocales: [
    import.meta.env.VITE_defaultLocale ?? DEFAULT_INTL_CONFIG.defaultLocale,
  ],
});

// Set default locale to one of the available locales
DEFAULT_INTL_CONFIG.defaultLocale = defaultIntlConfig.locale;
// Set default messages by the default locale
DEFAULT_INTL_CONFIG.messages = defaultIntlConfig.messages;
