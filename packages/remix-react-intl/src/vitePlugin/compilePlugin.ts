import {
  CompileOpts,
  ExtractOpts,
  compile as formatjsCompile,
  extract as formatjsExtract,
} from "@formatjs/cli-lib";
import { PseudoLocale } from "@formatjs/cli-lib/src/compile";
import fg from "fast-glob";
import fs from "node:fs/promises";
import path from "node:path";
import { MessageDescriptor } from "react-intl";
import type { Plugin } from "vite";
import { RemixUserConfig, dts } from "./extractPlugin.js";
import { name } from "./index.js";
import { Options } from "./optionsPlugin.js";

export default function compilePlugin(options: Options): Plugin {
  return {
    name: `${name}/compile`,
    apply(config) {
      return !("build" in config) && !("configFile" in config);
    },
    async config(config) {
      const { remixConfig } = (config as RemixUserConfig).__remixPluginContext;

      const routeIds = Object.values(remixConfig.routes).map(
        (route) => route.id,
      );

      const [compiledMessages, commonMessages, ...routeMessages] =
        await Promise.all([
          compile(options.compile, options.target),
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

      const localeRouteCompiledMessages: LocaleRouteCompiledMessages =
        new Map();

      setCompiledMessagesForRoutes(
        routeMessageIds,
        localeRouteCompiledMessages,
        compiledMessages,
      );

      inheritFromParentLocale(
        options.defaultLocale,
        options.locales,
        localeRouteCompiledMessages,
      );

      await write(localeRouteCompiledMessages, options.compiledTarget);
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
): Promise<CompiledAll> =>
  new Map(
    await Promise.all(
      (await fs.readdir(target))
        .map((file) => ({
          locale: path.parse(file).name,
          file: path.join(target, file),
        }))
        .map(
          async ({ file, locale }) =>
            [
              locale,
              new Map(
                Object.entries(
                  JSON.parse(
                    await formatjsCompile([file], {
                      pseudoLocale: pseudoLocales.includes(
                        locale as PseudoLocale,
                      )
                        ? (locale as PseudoLocale)
                        : undefined,
                      ...compileOpts,
                    }),
                  ) as Compiled,
                ),
              ),
            ] as const,
        ),
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

const baseLocales = (locale: string) =>
  locale
    .split("-")
    .map((_part, index, localeParts) =>
      localeParts.slice(0, index + 1).join("-"),
    )
    .reverse();

function inheritFromParentLocale(
  defaultLocale: string,
  locales: string[],
  localeRouteCompiledMessages: LocaleRouteCompiledMessages,
) {
  const inheritLocales = locales
    .map(baseLocales)
    .map((locales) =>
      locales[0] === defaultLocale ? locales : [...locales, defaultLocale],
    )
    .map(([locale, ...inheritFrom]) => ({
      locale: locale!,
      parent: inheritFrom.find((inherit) => locales.includes(inherit)),
    }));

  function inherit(base: string) {
    for (const { parent, locale } of inheritLocales) {
      if (parent === base) {
        const parentMessages = localeRouteCompiledMessages.get(parent)!;
        const routeMessages = localeRouteCompiledMessages.get(locale)!;
        for (const [routeId, parentRouteMessages] of parentMessages) {
          for (const [id, message] of parentRouteMessages) {
            const messages = routeMessages.get(routeId)!;
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

function write(
  localeRouteCompiledMessages: LocaleRouteCompiledMessages,
  compiledTarget: string,
) {
  return Promise.all(
    [...localeRouteCompiledMessages].flatMap(async ([locale, messages]) => {
      const to = path.join(compiledTarget!, locale);

      return [...messages].map(async ([routeId, messages]) => {
        await fs.mkdir(path.join(to, path.dirname(routeId)), {
          recursive: true,
        });
        await fs.writeFile(
          `${path.join(to, routeId)}.json`,
          JSON.stringify(Object.fromEntries(messages), null, 2),
        );
      });
    }),
  );
}
