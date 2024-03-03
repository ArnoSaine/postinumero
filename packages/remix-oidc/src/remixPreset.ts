import type { Preset } from "@remix-run/dev";
import { readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import configFromFile from "./configFromFile.js";
import { name } from "./main.js";

export default function remixPreset(configFile: string): Preset {
  return {
    name,
    async remixConfig() {
      const { appDirectory } = await readConfig();
      const config = await configFromFile(configFile);

      return {
        routes(defineRoutes) {
          return defineRoutes((route) => {
            route(
              config.routes.signin,
              path.relative(
                appDirectory,
                new URL("./app/routes/signin/route.js", import.meta.url)
                  .pathname
              )
            );
            route(
              config.routes.signout,
              path.relative(
                appDirectory,
                new URL("./app/routes/signout/route.js", import.meta.url)
                  .pathname
              )
            );
          });
        },
      };
    },
  };
}
