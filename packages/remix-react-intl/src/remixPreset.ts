import type { Preset } from "@remix-run/dev";
import { readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import { name } from "./main.js";
//import { Options } from "./vitePlugin/optionsPlugin.js";

export default function remixPreset(/*options: Options*/): Preset {
  return {
    name,
    async remixConfig() {
      const { appDirectory } = await readConfig();

      return {
        routes(defineRoutes) {
          return defineRoutes((route) => {
            route(
              //options.routes.locale,
              "/__locale",
              path.relative(
                appDirectory,
                new URL("./app/routes/locale/route.js", import.meta.url)
                  .pathname,
              ),
            );
          });
        },
      };
    },
  };
}
