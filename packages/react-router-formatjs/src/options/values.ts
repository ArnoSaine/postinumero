import type { Environment } from "@postinumero/react-router-formatjs/config";
import { mapKeys, uniq } from "lodash-es";
import type { ResolvedIntlConfig } from "react-intl";
import isVite from "../utils/is-vite.ts";

const normalizeProjectRootPath = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

export const langDirModules = isVite
  ? mapKeys(
      import.meta.glob<ResolvedIntlConfig["messages"]>(
        "/.lang/compiled/*.json",
        // Named exports are not supported. Some message IDs are not valid identifiers. Example: "f9g+9J"
        { import: "default" },
      ),
      (_value, key) => normalizeProjectRootPath(key),
    )
  : (new Proxy(
      {},
      {
        get: (_target, prop: string) => async () =>
          // Vite drops import assertions from dynamic imports in server builds → runtime error.
          // Use fs-based JSON loading instead.
          // (
          //   await import(/* @vite-ignore */ `${process.cwd()}${prop}`, {
          //     with: { type: "json" },
          //   })
          // ).default,
          JSON.parse(
            await globalThis.process
              .getBuiltinModule("fs/promises")
              .readFile(`${process.cwd()}${prop}`, "utf-8"),
          ),
        ownKeys: (_target) =>
          globalThis.process
            .getBuiltinModule("fs")
            .readdirSync(`${process.cwd()}/.lang/compiled`)
            .filter((file: string) => file.endsWith(".json"))
            .map((file) => `/.lang/compiled/${file}`),
        getOwnPropertyDescriptor: () => ({
          enumerable: true,
          configurable: true,
        }),
      },
    ) as Record<string, () => Promise<ResolvedIntlConfig["messages"]>>);

const getLangDirModulePath = (locale: string, environment: Environment) =>
  `/.lang/compiled/${[environment, locale].filter(Boolean).join(":")}.json`;

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
