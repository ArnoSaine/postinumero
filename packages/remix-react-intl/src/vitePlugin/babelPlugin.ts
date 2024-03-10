import babel, { PluginItem } from "@babel/core";
import path from "node:path";
import type { Plugin } from "vite";
import { name } from "./index.js";
import { Options } from "./optionsPlugin.js";

export default function babelPlugin(options: Options): Plugin {
  const pluginsMap = new Map<string | undefined, PluginItem[]>();

  return {
    name: `${name}/babel`,
    enforce: "pre",
    config: (_config) => {
      const plugin = ["formatjs", options.babel];
      pluginsMap.set(undefined, [plugin]);
      pluginsMap.set("ts", [plugin, "@babel/syntax-typescript"]);
      pluginsMap.set("tsx", [
        plugin,
        ["@babel/syntax-typescript", { isTSX: true }],
      ]);

      if (options.babel.ast) {
        return {
          resolve: {
            alias: {
              "@formatjs/icu-messageformat-parser":
                "@formatjs/icu-messageformat-parser/no-parser",
            },
          },
        };
      }
    },
    async transform(code, id) {
      if (id.includes("/node_modules/")) {
        return;
      }

      const filepath = id.split("?")[0]!;

      const extensionsRE = /\.(jsx?|tsx?|mdx?)$/;
      if (!extensionsRE.test(filepath)) {
        return;
      }

      const ext = path.extname(filepath).slice(1);

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
}
