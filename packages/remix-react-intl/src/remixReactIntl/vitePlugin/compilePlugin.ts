import {
  CompileOpts,
  ExtractOpts,
  compile as formatjsCompile,
  extract as formatjsExtract,
} from "@formatjs/cli-lib";
import { PseudoLocale } from "@formatjs/cli-lib/src/compile.js";
import get from "@postinumero/map-get-with-default";
import fg from "fast-glob";
import stringify from "json-stable-stringify";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { MessageDescriptor } from "react-intl";
import { rimraf } from "rimraf";
import type { Plugin } from "vite";
import { baseLocales } from "../../utils.js";
import memoize from "../../utils/cacheOperation.js";
import { RemixUserConfig, dts } from "./extractPlugin.js";
import { name } from "./index.js";
import { Options } from "./optionsPlugin.js";

export default function compilePlugin(options: Options): Plugin {
  return {
    name: `${name}/compile`,
    async config(config) {
      const localeRouteCompiledMessages: LocaleRouteCompiledMessages =
        new Map();

      const compiledMessagesPromise = compile(
        options.compile,
        options.target,
        options.defaultLocale,
      );

      const routeMessageIds: RouteMessageIds = options.singleOutput
        ? new Map([
            [
              "root",
              new Set(
                (await compiledMessagesPromise)
                  .get(options.defaultLocale)!
                  .keys(),
              ),
            ],
          ])
        : await (async () => {
            const { remixConfig } = (config as RemixUserConfig)
              .__remixPluginContext;

            const routeIds = Object.values(remixConfig.routes).map(
              (route) => route.id,
            );

            const [commonMessages, ...routeMessages] = await Promise.all([
              extractCommonMessages(
                remixConfig.appDirectory,
                options.extract,
                routeIds,
              ),
              ...routeIds.map(
                extractRoute(remixConfig.appDirectory, options.extract),
              ),
            ]);

            const commonMessageIds = new Set(Object.keys(commonMessages));
            const routeMessageIds: RouteMessageIds = new Map(
              routeMessages.map(({ routeId, messages }) => [
                routeId,
                new Set(Object.keys(messages)),
              ]),
            );

            removeCommonMessagesFromRoutes(commonMessageIds, routeMessageIds);

            return routeMessageIds;
          })();

      setCompiledMessagesForRoutes(
        routeMessageIds,
        localeRouteCompiledMessages,
        await compiledMessagesPromise,
      );

      inheritFromParentLocale(
        options.defaultLocale,
        options.locales,
        localeRouteCompiledMessages,
      );

      await write(
        localeRouteCompiledMessages,
        await options._compiledTargetPromise,
      );

      options._asyncManifest.resolve(
        JSON.parse(
          await fs.readFile(
            path.join(await options._compiledTargetPromise, manifestFile),
            "utf-8",
          ),
        ),
      );
    },
  };
}

type Locale = string;
type RouteId = string;
type MessageId = string;
type MessageDescriptors = Record<MessageId, MessageDescriptor>;
type CompiledAll = Map<Locale, Compiled>;
type Compiled = Map<MessageId, CompiledEntry>;
type CompiledEntry = string | Record<string, number | string>[];
type LocaleRouteCompiledMessages = Map<Locale, Map<RouteId, Compiled>>;
type RouteMessageIds = Map<string, Set<string>>;

const pseudoLocales = ["en-XA", "en-XB", "xx-AC", "xx-HA", "xx-LS"] as const;

const compile = async (
  compileOpts: CompileOpts,
  target: string,
  defaultLocale: string,
): Promise<CompiledAll> =>
  new Map(
    await Promise.all(
      (await fs.readdir(target))
        .map((file) => ({
          locale: path.parse(file).name,
          file: path.join(target, file),
        }))
        .map(async ({ file, locale }, _, files) => {
          const pseudoLocale = pseudoLocales.includes(locale as PseudoLocale)
            ? (locale as PseudoLocale)
            : undefined;

          const compileAndParse = async (file: string): Promise<Compiled> =>
            JSON.parse(
              await formatjsCompile([file], {
                pseudoLocale,
                ...compileOpts,
              }),
            );

          const messages = await compileAndParse(file);
          const defaultLocaleFile = files.find(
            (file) => file.locale === defaultLocale,
          )!.file;

          return [
            locale,
            new Map(
              Object.entries(
                pseudoLocale
                  ? {
                      ...(await compileAndParse(defaultLocaleFile)),
                      ...messages,
                    }
                  : messages,
              ),
            ),
          ] as const;
        }),
    ),
  );

const extractCommonMessages = async (
  appDirectory: string,
  extractOpts: ExtractOpts,
  routeIds: string[],
) =>
  JSON.parse(
    await formatjsExtract(
      await fg(`${appDirectory}/**/*.{j,t}s{,x}`, {
        ignore: [
          dts,
          ...routeIds.map((routeId) => `${appDirectory}/${routeId}{,/**/*}.*`),
        ],
      }),
      extractOpts,
    ),
  ) as MessageDescriptors;

const extractRoute =
  (appDirectory: string, extractOpts: ExtractOpts) =>
  async (routeId: string) => ({
    routeId,
    messages: JSON.parse(
      await formatjsExtract(
        await fg(`${appDirectory}/${routeId}{,/**/*}.{j,t}s{,x}`, {
          ignore: [dts],
        }),
        extractOpts,
      ),
    ) as MessageDescriptors,
  });

function removeCommonMessagesFromRoutes(
  common: Set<string>,
  routes: Map<string, Set<string>>,
) {
  // TODO: remove if route.parentId has the message
  for (const [, value] of routes) {
    for (const id of value) {
      if (common.has(id)) {
        value.delete(id);
      }
    }
  }

  const root = routes.get("root");
  for (const id of common) {
    root!.add(id);
  }
}

function setCompiledMessagesForRoutes(
  routeMessageIds: RouteMessageIds,
  localeRouteCompiledMessages: LocaleRouteCompiledMessages,
  compiledMessages: CompiledAll,
) {
  for (const [locale, messages] of compiledMessages) {
    const routeCompiledMessages = new Map();
    localeRouteCompiledMessages.set(locale, routeCompiledMessages);
    for (const [route, messageIds] of routeMessageIds) {
      const compiledMessages = new Map<string, CompiledEntry>();
      routeCompiledMessages.set(route, compiledMessages);
      for (const messageId of messageIds) {
        const message = messages.get(messageId);
        if (message) {
          compiledMessages.set(messageId, message);
        }
      }
    }
  }
}

function inheritFromParentLocale(
  defaultLocale: string,
  locales: string[],
  localeRouteCompiledMessages: LocaleRouteCompiledMessages,
) {
  const availableLocales = locales.includes(defaultLocale)
    ? locales
    : [...locales, defaultLocale];

  const inheritLocales = locales
    .map(baseLocales)
    .map((locales) =>
      locales[0] === defaultLocale ? locales : [...locales, defaultLocale],
    )
    .map(([locale, ...inheritFrom]) => ({
      locale: locale!,
      parent: inheritFrom.find((inherit) => availableLocales.includes(inherit)),
    }));

  function inherit(base: string) {
    for (const { parent, locale } of inheritLocales) {
      if (parent === base) {
        const parentMessages = localeRouteCompiledMessages.get(parent)!;
        const routeMessages = get(
          localeRouteCompiledMessages,
          locale,
          () => new Map(),
        );

        for (const [routeId, parentRouteMessages] of parentMessages) {
          for (const [id, message] of parentRouteMessages) {
            const messages = get(routeMessages, routeId, () => new Map());
            if (!messages.has(id)) {
              messages.set(id, message);
            }
          }
        }
        inherit(locale);
      }
    }
  }

  inherit(defaultLocale);
}

export type Manifest = { [locale: string]: { [route: string]: string } };

async function write(
  localeRouteCompiledMessages: LocaleRouteCompiledMessages,
  compiledTarget: string,
) {
  await memoize(
    async () => {
      const manifest: Manifest = {};

      await rimraf(compiledTarget);

      await Promise.all(
        [...localeRouteCompiledMessages].map(async ([locale, messages]) => {
          const to = path.join(compiledTarget, locale);

          return Promise.all(
            [...messages].map(async ([routeId, messages]) => {
              await fs.mkdir(path.join(to, path.dirname(routeId)), {
                recursive: true,
              });
              const data = JSON.stringify(
                Object.fromEntries(messages),
                null,
                2,
              );

              const hash = createHash("sha512");
              hash.update(data);
              const digest = hash.digest("base64url").slice(0, 6);

              manifest[locale] ??= {};
              manifest[locale][routeId] = digest;

              await fs.writeFile(
                `${path.join(to, routeId)}-${digest}.json`,
                data,
              );
            }),
          );
        }),
      );

      await fs.writeFile(
        path.join(compiledTarget, manifestFile),
        // File content hash is used to cache compile results.
        // Ensure keys are in same order.
        stringify(manifest, { space: 2 })!,
      );
    },
    {
      name: "compiling messages",
      outputs: [compiledTarget],
      inputs: [],
      dependencies: [localeRouteCompiledMessages],
    },
  );
}

export const manifestFile = "manifest.json";
