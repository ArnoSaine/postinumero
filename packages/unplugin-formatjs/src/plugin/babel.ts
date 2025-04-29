import babel, { PluginItem } from "@babel/core";
import { Options } from "babel-plugin-formatjs/types.js";
import { extname } from "node:path";
import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";

export type BabelOptions = Options;

const extensionsRE = /\.(jsx?|tsx?|mdx?)$/;

export const unpluginFactory: UnpluginFactory<
  BabelOptions | undefined,
  false
> = (options = {}) => {
  const pluginsMap = new Map<string | undefined, PluginItem[]>();

  options.preserveWhitespace ??= true;
  options.removeDefaultMessage ??= process.env.NODE_ENV === "production";
  const plugin = ["formatjs", options];
  pluginsMap.set(undefined, [plugin]);
  pluginsMap.set("ts", [plugin, "@babel/syntax-typescript"]);
  pluginsMap.set("tsx", [
    plugin,
    ["@babel/syntax-typescript", { isTSX: true }],
  ]);

  return {
    name: "@postinumero/unplugin-formatjs/babel",
    enforce: "pre",
    transformInclude(id) {
      if (id.includes("/node_modules/")) {
        return;
      }

      const [filepath] = id.split("?");

      if (!extensionsRE.test(filepath)) {
        return;
      }

      return true;
    },
    async transform(code, id) {
      const [filepath] = id.split("?");

      const ext = extname(filepath).slice(1);

      const result = await babel.transformAsync(code, {
        filename: id,
        sourceFileName: filepath,
        parserOpts: {
          sourceType: "module",
          allowAwaitOutsideFunction: true,
        },
        plugins: pluginsMap.get(pluginsMap.has(ext) ? ext : undefined),
        sourceMaps: true,
      });

      if (result === null) {
        return;
      }

      return { code: result.code!, map: result.map };
    },
  };
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
