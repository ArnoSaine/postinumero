import moduleProxy from "@postinumero/vite-plugin-module-proxy";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  plugins: [
    remix(),
    tsconfigPaths(),
    moduleProxy({ id: "./some-library", proxy: "./app/proxy-1" }),
    moduleProxy({ id: "./some-library", proxy: "./app/proxy-2.tsx" }),
    moduleProxy({ id: "./some-library", proxy: "./app/proxy-3.ts" }),
  ],
});
