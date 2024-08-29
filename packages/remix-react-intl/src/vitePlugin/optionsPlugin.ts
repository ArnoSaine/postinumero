import { CompileOpts, ExtractOpts } from "@formatjs/cli-lib";
import { VitePluginConfig } from "@remix-run/dev";
import { DEFAULT_ID_INTERPOLATION_PATTERN } from "babel-plugin-formatjs";
import { Options as BabelPluginOpts } from "babel-plugin-formatjs/types.js";
import { cloneDeep, pick } from "lodash-es";
import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";
import { ConfigEnv, UserConfig } from "vite";
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
  routes?: {
    locale?: string;
  };
  singleOutput?: boolean;
  _compiledTargetAwaited?: string;
  _compiledTargetPromise?: Promise<Options["_compiledTargetAwaited"]>;
  _localePreferenceMethodAwaited?: "localStorage.client" | "session.server";
  _localePreferenceMethodPromise?: Promise<
    Options["_localePreferenceMethodAwaited"]
  >;
  _ssr?: boolean;
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
  "routes",
  "singleOutput",
  "_localePreferenceMethodAwaited",
  "_ssr",
] as const;
export type PublicOptions = Pick<Options, (typeof publicOptions)[number]>;

const optionsPlugin = (
  _options: Opts,
  remixVitePluginConfigPromise: Promise<VitePluginConfig>,
) => {
  const virtualModuleId = "virtual:@postinumero/remix-react-intl/options";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  const options = {} as Options;
  const api = { options };

  const optionsPromise = async () => ({
    ...options,
    _compiledTargetAwaited: await options._compiledTargetPromise,
    _localePreferenceMethodAwaited:
      await options._localePreferenceMethodPromise,
    _ssr: (await remixVitePluginConfigPromise).ssr,
  });

  return {
    name: `${name}/options`,
    enforce: "pre",
    api,
    config: async (config, env) => {
      Object.assign(
        options,
        await getOptions(_options, config, env, remixVitePluginConfigPromise),
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
  config?: UserConfig,
  env?: ConfigEnv,
  remixVitePluginConfigPromise?: Promise<VitePluginConfig>,
) => {
  const options = {} as Options;

  if (typeof _options === "function") {
    _options = _options(config, env, remixVitePluginConfigPromise);
  }

  Object.assign(options, cloneDeep(_options));

  const isProduction = env?.mode === "production";

  options.target ??= "lang";
  options.compiledTargetPublicPath ??= ".compiled-lang";
  options.defaultLocale ??= "en-default";
  options.fallbackLocale ??= options.defaultLocale.split("-")[0]!;
  options.locales ??= (await fs.readdir(options.target))
    .map((file) => path.parse(file).name)
    .filter((locale) => locale !== options.defaultLocale);
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
  options.routes ??= {};
  options.routes.locale ??= "/__locale";
  options.singleOutput ??= true;
  options._compiledTargetPromise ??= new Promise(async (resolve) => {
    const remixVitePluginConfig = await remixVitePluginConfigPromise;
    resolve(
      remixVitePluginConfig?.ssr
        ? options.compiledTargetPublicPath
        : `public/${options.compiledTargetPublicPath}`,
    );
  });
  options._localePreferenceMethodPromise ??= new Promise(async (resolve) => {
    const remixVitePluginConfig = await remixVitePluginConfigPromise;
    resolve(
      remixVitePluginConfig?.ssr ? "session.server" : "localStorage.client",
    );
  });

  return options;
};
