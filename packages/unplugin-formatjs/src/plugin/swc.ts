import swc from "@swc/core";
import { Options } from "babel-plugin-formatjs/types.js";
import { extname } from "node:path";
import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";

export type SWCOptions = Options;

const extensionsRE = /\.(jsx?|tsx?|mdx?)$/;

export const unpluginFactory: UnpluginFactory<SWCOptions | undefined, false> = (
  options = {},
) => {
  options.preserveWhitespace ??= true;
  options.removeDefaultMessage ??= process.env.NODE_ENV === "production";

  return {
    name: "@postinumero/unplugin-formatjs/swc",
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

      const result = await swc.transform(code, {
        filename: id,
        sourceMaps: true,
        jsc: {
          parser: ["ts", "tsx"].includes(ext)
            ? {
                syntax: "typescript",
                tsx: true,
              }
            : {
                syntax: "ecmascript",
                jsx: true,
              },
          experimental: {
            cacheRoot: "node_modules/.cache/swc",
            plugins: [["@swc/plugin-formatjs", options]],
          },
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      });
      console.log("swc", result.code);

      return result;
    },
  };
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
