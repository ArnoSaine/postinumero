import { CompileOpts, ExtractOpts } from "@formatjs/cli-lib";
import { DEFAULT_ID_INTERPOLATION_PATTERN } from "babel-plugin-formatjs";
import { Options as BabelPluginOpts } from "babel-plugin-formatjs/types.js";
import { cloneDeep, pick } from "lodash-es";
import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";
import { ConfigEnv } from "vite";
import { name } from "./index.js";

export interface UserOptions {
  target?: string;
  compiledTarget?: string;
  defaultLocale?: string;
  fallbackLocale?: string;
  locales?: string[];
  preserveWhitespace?: boolean;
  babel?: BabelPluginOpts;
  compile?: CompileOpts;
  extract?: ExtractOpts;
  routes?: {
    locale?: string;
  };
}

export type Options = Required<UserOptions>;
export type Opts = UserOptions | ((env: ConfigEnv) => UserOptions) | undefined;
const publicOptions = ["fallbackLocale", "locales", "routes"] as const;
export type PublicOptions = Pick<Options, (typeof publicOptions)[number]>;

const optionsPlugin = (_options: Opts) => {
  const virtualModuleId = "@postinumero/remix-react-intl/options";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  const options = {} as Options;
  const api = { options };

  return {
    name: `${name}/options`,
    enforce: "pre",
    api,
    config: async (_config, env) => {
      if (typeof _options === "function") {
        _options = _options(env);
      }

      Object.assign(options, cloneDeep(_options));

      const isProduction = env?.mode === "production";

      options.target ??= "lang";
      options.compiledTarget ??= ".compiled-lang";
      options.defaultLocale ??= "en-default";
      options.fallbackLocale ??= "en";
      options.locales ??= (await fs.readdir(options.target))
        .map((file) => path.parse(file).name)
        .filter((locale) => locale !== "en-default");
      if (!options.locales.includes(options.fallbackLocale)) {
        options.locales.unshift(options.fallbackLocale);
      }
      options.preserveWhitespace ??= true;
      options.babel ??= {};
      options.babel.preserveWhitespace ??= options.preserveWhitespace;
      options.babel.removeDefaultMessage ??= isProduction;
      options.babel.ast ??= isProduction;
      options.compile ??= {};
      options.compile.ast ??= true;
      options.extract ??= {};
      options.extract.idInterpolationPattern ??=
        DEFAULT_ID_INTERPOLATION_PATTERN;
      options.extract.preserveWhitespace ??= options.preserveWhitespace;
      options.routes ??= {};
      options.routes.locale ??= "/__locale";
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
      if (id === `${virtualModuleId}.server`) {
        return `${resolvedVirtualModuleId}.server`;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `const options = ${JSON.stringify(pick(options, publicOptions))};
export default options;`;
      }
      if (id === `${resolvedVirtualModuleId}.server`) {
        return `const options = ${JSON.stringify(options)};
export default options;`;
      }
    },
  } as Plugin<typeof api>;
};

export default optionsPlugin;
