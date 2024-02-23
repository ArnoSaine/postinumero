import mui from "@postinumero/vite-plugin-remix-mui";
import { vitePlugin as remix } from "@remix-run/dev";
import { VitePluginConfig } from "@remix-run/dev/dist/vite/plugin";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export const config = (
  options: {
    remix?: VitePluginConfig;
  } = {}
) =>
  defineConfig({
    plugins: [remix(options.remix), tsconfigPaths(), mui],
  });

export default config();
