import { CompileOpts, ExtractOpts } from "@formatjs/cli-lib";
import { interpolateName } from "@formatjs/ts-transformer";
import { VitePluginConfig } from "@remix-run/dev";
import { DEFAULT_ID_INTERPOLATION_PATTERN } from "babel-plugin-formatjs";
import { Options as BabelPluginOpts } from "babel-plugin-formatjs/types.js";
import stringify from "json-stable-stringify";
import { cloneDeep, pick } from "lodash-es";
import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";
import { ConfigEnv, UserConfig } from "vite";
import { Manifest } from "./compilePlugin.js";
import { name } from "./index.js";

export interface UserOptions {
  target?: string;
  compiledTargetPublicPath?: string;
  defaultLocale?: string;
  fallbackLocale?: string;
  locales?: string[];
  localStorageKey?: string;
  preserveWhitespace?: boolean;
  babel?: BabelPluginOpts;
  compile?: CompileOpts;
  extract?: ExtractOpts;
  singleOutput?: boolean;
  _compiledTargetAwaited?: string;
  _compiledTargetPromise?: Promise<Options["_compiledTargetAwaited"]>;
  _loaderDataName?: string;
  _localePreferenceMethodAwaited?: "localStorage" | "session";
  _localePreferenceMethodPromise?: Promise<
    Options["_localePreferenceMethodAwaited"]
  >;
  _manifestAwaited?: Manifest;
  _manifestPromise?: Promise<Options["_manifestAwaited"]>;
  _asyncManifest?: {
    resolve(value: Manifest): void;
    promise: Promise<Manifest>;
  };
  _ssrAwaited?: boolean;
  _ssrPromise?: Promise<Options["_ssrAwaited"]>;
}

export type Options = Required<UserOptions>;
export type Opts =
  | UserOptions
  | ((
      config?: UserConfig,
      env?: ConfigEnv,
      remixUserConfigPromise?: Promise<VitePluginConfig>,
    ) => UserOptions)
  | undefined;
const publicOptions = [
  "compiledTargetPublicPath",
  "fallbackLocale",
  "locales",
  "localStorageKey",
  "singleOutput",
  "_loaderDataName",
  "_localePreferenceMethodAwaited",
  "_manifestAwaited",
  "_ssrAwaited",
] as const;

export type PublicOptions = Pick<Options, (typeof publicOptions)[number]>;

const optionsPlugin = (
  _options: Opts,
  remixVitePluginConfigPromise: Promise<VitePluginConfig>,
) => {
  const virtualModuleId = `${name}/options`;
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  const options = {} as Options;
  const api = { options };

  const optionsPromise = async () => ({
    ...options,
    _compiledTargetAwaited: await options._compiledTargetPromise,
    _localePreferenceMethodAwaited:
      await options._localePreferenceMethodPromise,
    _manifestAwaited: await options._asyncManifest.promise,
    _ssrAwaited: (await remixVitePluginConfigPromise).ssr,
  });

  return {
    name: virtualModuleId,
    enforce: "pre",
    api,
    config: async (config, env) => {
      Object.assign(
        options,
        await getOptions(_options, remixVitePluginConfigPromise, config, env),
      );
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
      if (id === `${virtualModuleId}.server`) {
        return `${resolvedVirtualModuleId}.server`;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(pick(await optionsPromise(), publicOptions))};`;
      }
      if (id === `${resolvedVirtualModuleId}.server`) {
        return `export default ${JSON.stringify(await optionsPromise())};`;
      }
    },
  } as Plugin<typeof api>;
};

export default optionsPlugin;

export const getOptions = async (
  _options: Opts,
  remixVitePluginConfigPromise?: Promise<VitePluginConfig>,
  config?: UserConfig,
  env?: ConfigEnv,
) => {
  const options = {} as Options;

  if (typeof _options === "function") {
    _options = _options(config, env, remixVitePluginConfigPromise);
  }

  Object.assign(options, cloneDeep(_options));

  const isProduction = env?.mode === "production";

  const ssrPromise = new Promise<boolean>(async (resolve) => {
    const remixVitePluginConfig = await remixVitePluginConfigPromise;
    resolve(remixVitePluginConfig?.ssr ?? true);
  });

  options.target ??= "lang";
  options.compiledTargetPublicPath ??= ".compiled-lang";
  options.defaultLocale ??= "en-default";
  options.fallbackLocale ??= options.defaultLocale.split("-")[0]!;
  try {
    options.locales ??= (await fs.readdir(options.target))
      .map((file) => path.parse(file).name)
      .filter((locale) => locale !== options.defaultLocale);
  } catch (err) {
    options.locales ??= [];
  }
  if (!options.locales.includes(options.fallbackLocale)) {
    options.locales.unshift(options.fallbackLocale);
  }
  options.localStorageKey ??= "__locale";
  options.preserveWhitespace ??= true;
  options.babel ??= {};
  options.babel.preserveWhitespace ??= options.preserveWhitespace;
  options.babel.removeDefaultMessage ??= isProduction;
  options.babel.ast ??= isProduction;
  options.compile ??= {};
  options.compile.ast ??= true;
  options.extract ??= {};
  options.extract.idInterpolationPattern ??= DEFAULT_ID_INTERPOLATION_PATTERN;
  options.extract.preserveWhitespace ??= options.preserveWhitespace;
  options.singleOutput ??= true;
  options._compiledTargetPromise ??= new Promise(async (resolve) => {
    resolve(
      (await ssrPromise)
        ? options.compiledTargetPublicPath
        : `public/${options.compiledTargetPublicPath}`,
    );
  });
  options._loaderDataName ??= "__intl";
  options._localePreferenceMethodPromise ??= new Promise(async (resolve) => {
    resolve(((await ssrPromise) ?? true) ? "session" : "localStorage");
  });
  options._asyncManifest ??= Promise.withResolvers();

  options._ssrPromise ??= ssrPromise;

  // For generated IDs to match, this must be same as when extracting messages:
  // https://github.com/formatjs/formatjs/blob/main/packages/cli-lib/src/extract.ts#L131C1-L152C4
  options.babel.overrideIdFn ??= (id, defaultMessage, description, fileName) =>
    id ||
    interpolateName(
      { resourcePath: fileName },
      options.extract.idInterpolationPattern!,
      {
        content: description
          ? `${defaultMessage}#${
              typeof description === "string"
                ? description
                : stringify(description)
            }`
          : defaultMessage,
      },
    );

  return options;
};
