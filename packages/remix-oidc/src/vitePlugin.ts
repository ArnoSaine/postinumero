import remixRoot from "@postinumero/vite-plugin-replace-module/lib/presets/remix-root.js";
import type { Plugin } from "vite";
import { resolveConfigFile } from "./configFromFile.js";

export default async function vitePlugin(configFile: string) {
  configFile = await resolveConfigFile(configFile);

  return [
    {
      name: "@postinumero/remix-oidc",
      resolveId(source) {
        if (source === "virtual:remix-oidc/config") {
          return configFile;
        }
      },
    } as Plugin,
    remixRoot({ url: import.meta.url }),
  ];
}
