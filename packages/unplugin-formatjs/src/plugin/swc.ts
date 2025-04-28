import swc from "@swc/core";
import { extname } from "node:path";
import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";
import type { Options } from "../types.ts";

const extensionsRE = /\.(jsx?|tsx?|mdx?)$/;

export const unpluginFactory: UnpluginFactory<
  Exclude<Options["swc"], false> | undefined,
  false
> = (options = {}) => {
  options.preserveWhitespace ??= true;
  options.removeDefaultMessage ??= process.env.NODE_ENV === "production";

  return {
    name: "@postinumero/unplugin-formatjs/swc",
    resolveId(id) {
      if (id === "@formatjs/icu-messageformat-parser") {
        return "@formatjs/icu-messageformat-parser/no-parser";
      }
    },
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

      return swc.transform(code, {
        filename: id,
        sourceMaps: true,
        jsc: {
          parser: {
            syntax: ["ts", "tsx"].includes(ext) ? "typescript" : "ecmascript",
          },
          experimental: {
            plugins: [["@swc/plugin-formatjs", options]],
          },
        },
      });
    },
  };
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
