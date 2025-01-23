// For Node.js versions below 22, install and import the polyfill:
//import "core-js/proposals/promise-with-resolvers";

import { vitePlugin as remix } from "../$node_modules/@remix-run/dev/dist/index.js";
import tsconfigPaths from "../$node_modules/vite-tsconfig-paths/dist/index.mjs";
import { defineConfig } from "../$node_modules/vite/dist/node/index.js";
import remixOidc from "../lib/main.js";

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
