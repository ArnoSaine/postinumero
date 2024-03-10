import {
  CompileOpts,
  ExtractOpts,
  compile as formatjsCompile,
  extract as formatjsExtract,
} from "@formatjs/cli-lib";
import { PseudoLocale } from "@formatjs/cli-lib/src/compile";
import { readConfig } from "@remix-run/dev/dist/config.js";
import { DEFAULT_ID_INTERPOLATION_PATTERN } from "babel-plugin-formatjs";
import fg from "fast-glob";
import { exec } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { MessageDescriptor } from "react-intl";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type Locale = string;
type RouteId = string;
type MessageId = string;
type MessageDescriptors = Record<MessageId, MessageDescriptor>;
type CompiledAll = Map<Locale, Compiled>;
type Compiled = Map<MessageId, CompiledEntry>;
type CompiledEntry = string | Record<string, number | string>[];
type LocaleRouteCompiledMessages = Map<Locale, Map<RouteId, Compiled>>;
type RouteMessageIds = Map<string, Set<string>>;

const config = await readConfig();

const defaults = {
  target: "lang",
  compiledTarget: "compiled-lang",
  defaultLocale: "default",
  availableLocales: ["default"],
  compileOpts: {
    ast: true,
  } as CompileOpts,
  extractOpts: {
    idInterpolationPattern: DEFAULT_ID_INTERPOLATION_PATTERN,
    preserveWhitespace: true,
    extractSourceLocation: !true,
  } as ExtractOpts,
};

const dts = "**/*.d.ts";
const pseudoLocales = ["en-XA", "en-XB", "xx-AC", "xx-HA", "xx-LS"] as const;

export default async function extract(
  options: DeepPartial<typeof defaults> = {},
) {
  options.target ??= defaults.target;
  options.compiledTarget ??= defaults.compiledTarget;
  options.defaultLocale ??= defaults.defaultLocale;
  options.compileOpts ??= {};
  options.compileOpts.ast ??= defaults.compileOpts.ast;
  options.extractOpts ??= {};
  options.extractOpts.idInterpolationPattern ??=
    defaults.extractOpts.idInterpolationPattern;
  options.extractOpts.preserveWhitespace ??=
    defaults.extractOpts.preserveWhitespace;
  options.extractOpts.extractSourceLocation ??=
    defaults.extractOpts.extractSourceLocation;

  const routeIds = Object.values(config.routes).map((route) => route.id);

  const [allMessages, routeNameMessages] = await Promise.all([
    extractAllMessages(options.extractOpts),
    extractRoutes(options.extractOpts, routeIds),
  ]);

  await fs.writeFile(
    `${options.target}/${options.defaultLocale}.json`,
    mergeJSON(allMessages, routeNameMessages),
  );

  const [compiledMessages, commonMessages, ...routeMessages] =
    await Promise.all([
      compile(options.compileOpts, options.target),
      extractCommonMessages(options.extractOpts, routeIds),
      ...routeIds.map(extractRoute(options.extractOpts)),
    ]);

  const commonMessageIds = new Set(Object.keys(commonMessages));
  const routeMessageIds: RouteMessageIds = new Map(
    routeMessages.map(({ routeId, messages }) => [
      routeId,
      new Set(Object.keys(messages)),
    ]),
  );

  removeCommonMessagesFromRoutes(commonMessageIds, routeMessageIds);

  const localeRouteCompiledMessages: LocaleRouteCompiledMessages = new Map();

  setCompiledMessagesForRoutes(
    routeMessageIds,
    localeRouteCompiledMessages,
    compiledMessages,
  );

  inheritFromParentLocale(options.defaultLocale, localeRouteCompiledMessages);

  await write(localeRouteCompiledMessages, options.compiledTarget);
}

const extractAllMessages = async (extractOpts: ExtractOpts) =>
  formatjsExtract(
    await fg(`${config.appDirectory}/**/*.{j,t}s{,x}`, {
      ignore: [dts],
    }),
    extractOpts,
  );

const extractRoutes = async (extractOpts: ExtractOpts, routeIds: string[]) =>
  new Promise<string>((resolve, reject) => {
    const child = exec(
      `node --input-type=module --eval 'import { extract } from "@formatjs/cli-lib";

process.stdout.write(await extract([], ${JSON.stringify({
        ...extractOpts,
        extractSourceLocation: false,
        readFromStdin: true,
      })}));'`,
      (error, success) => {
        if (error) {
          reject(error);
        } else {
          resolve(success);
        }
      },
    );

    child.stdin!.write(
      routeIds
        .map((routeId) => `defineMessage({defaultMessage:"${routeId}"})`)
        .join(";"),
    );

    child.stdin!.end();
  });

const mergeJSON = (...texts: string[]) =>
  JSON.stringify(
    Object.assign({}, ...texts.map((text) => JSON.parse(text))),
    null,
    2,
  );

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
  extractOpts: ExtractOpts,
  routeIds: string[],
) =>
  JSON.parse(
    await formatjsExtract(
      await fg(`${config.appDirectory}/**/*.{j,t}s{,x}`, {
        ignore: [
          dts,
          ...routeIds.map(
            (routeId) => `${config.appDirectory}/${routeId}{,/**/*}.*`,
          ),
        ],
      }),
      extractOpts,
    ),
  ) as MessageDescriptors;

const extractRoute = (extractOpts: ExtractOpts) => async (routeId: string) => ({
  routeId,
  messages: JSON.parse(
    await formatjsExtract(
      await fg(`${config.appDirectory}/${routeId}{,/**/*}.{j,t}s{,x}`, {
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
  localeRouteCompiledMessages: LocaleRouteCompiledMessages,
) {
  const availableLocales = [...localeRouteCompiledMessages.keys()];
  const inheritLocales = availableLocales
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
