import type { Options } from "@postinumero/unplugin-formatjs/types";
import formatjs from "@postinumero/unplugin-formatjs/vite";
import type { Plugin } from "vite";

const resolveReactRouterConfig = {
  name: "@postinumero/react-router-formatjs/resolve-alias/react-router.config",
  config: () => ({
    resolve: {
      alias: {
        "@postinumero/react-router-formatjs/react-router.config":
          process.cwd() + "/react-router.config.ts",
      },
    },
  }),
} as Plugin;

export default (options?: Options) => [
  formatjs(options),
  resolveReactRouterConfig,
];
