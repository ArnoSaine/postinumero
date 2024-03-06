import mui from "@postinumero/vite-plugin-remix-mui";
import moduleProxy from "@postinumero/vite-plugin-replace-module";
import remixRoot from "@postinumero/vite-plugin-replace-module/lib/presets/remix-root.js";
import { vitePlugin as remix } from "@remix-run/dev";
import { VitePluginConfig } from "@remix-run/dev/dist/vite/plugin";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export const config = async (
  options: {
    remix?: VitePluginConfig;
  } = {}
) =>
  defineConfig({
    plugins: [
      remix(options.remix),
      tsconfigPaths(),
      mui,
      ...(await remixRoot({ url: import.meta.url })),
      moduleProxy({ id: "./moo", proxy: "./app/moo-patch-1.ts" }),
      moduleProxy({ id: "./moo", proxy: "./app/moo-patch-2.ts" }),
      moduleProxy({ id: "./moo", proxy: "./app/moo-patch-3.ts" }),
    ],
  });

export default config();
