import type { Preset, VitePluginConfig } from "@remix-run/dev";
import { readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import { name } from "./main.js";
import { Options } from "./vitePlugin/optionsPlugin.js";

export default function remixPreset(
  options: Options,
  resolveRemixVitePluginConfig: (remixUserConfig: VitePluginConfig) => void,
): Preset {
  return {
    name,
    async remixConfig({ remixUserConfig }) {
      const { appDirectory } = await readConfig();
      resolveRemixVitePluginConfig(remixUserConfig);

      return {
        async routes(defineRoutes) {
          return defineRoutes((route) => {
            route(
              options.routes.locale,
              path.relative(
                appDirectory,
                new URL(
                  remixUserConfig.ssr
                    ? "./localePreference/route.js"
                    : "./localePreference/route.spa.js",
                  import.meta.url,
                ).pathname,
              ),
            );
          });
        },
      };
    },
  };
}
