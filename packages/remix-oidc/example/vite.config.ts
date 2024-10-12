// For Node.js versions below 22, install and import the polyfill:
//import "core-js/proposals/promise-with-resolvers";

import remixOidc from "@postinumero/remix-oidc";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const oidc = await remixOidc();

export default defineConfig({
  plugins: [
    remix({
      ssr: false,
      presets: [oidc.remixPreset],
    }),
    tsconfigPaths(),
    oidc.vitePlugin,
  ],
});
