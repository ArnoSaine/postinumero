import remixRoot from "@postinumero/vite-plugin-module-proxy/presets/remix-root";
import type { Plugin } from "vite";
import { resolveConfigFile } from "./configFromFile.js";
import { name } from "./main.js";

export default async function vitePlugin(configFile: string) {
  configFile = await resolveConfigFile(configFile);

  return [
    {
      name,
      config: () => ({
        resolve: {
          alias: {
            [`${name}/user-config`]: configFile,
          },
        },
      }),
    } as Plugin,
    ...(await remixRoot({ url: import.meta.url })),
  ];
}
