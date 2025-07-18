import type { Environment } from "@postinumero/react-router-formatjs/config";
import { uniq } from "lodash-es";
import type { ResolvedIntlConfig } from "react-intl";

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
