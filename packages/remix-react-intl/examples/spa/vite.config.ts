// For Node.js versions below 22, install and import the polyfill:
//import "core-js/proposals/promise-with-resolvers";

import remixReactIntl from "@postinumero/remix-react-intl/remixReactIntl";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

const intl = await remixReactIntl();

export default defineConfig({
  plugins: [
    remix({ presets: [intl.remixPreset], ssr: false }),
    tsconfigPaths(),
    intl.vitePlugin,
  ],
});
