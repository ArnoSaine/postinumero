import mui from "@postinumero/vite-plugin-remix-mui";
import { vitePlugin as remix } from "@remix-run/dev";
import { VitePluginConfig } from "@remix-run/dev/dist/vite/plugin";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export const config = async (
  options: {
    remix?: VitePluginConfig;
  } = {},
) =>
  defineConfig({
    plugins: [remix(options.remix), mui(), tsconfigPaths()],
  });

export default config();
