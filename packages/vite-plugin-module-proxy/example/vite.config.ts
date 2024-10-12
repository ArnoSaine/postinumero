// For Node.js versions below 22, install and import the polyfill:
//import "core-js/proposals/promise-with-resolvers";

import moduleProxy from "@postinumero/vite-plugin-module-proxy/main";
import remixRoot from "@postinumero/vite-plugin-module-proxy/presets/remix-root";
import remixRoutes from "@postinumero/vite-plugin-module-proxy/presets/remix-routes";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  plugins: [
    remix(),
    tsconfigPaths(),

    moduleProxy({
      target: "lodash-es",
      handler: "./app/modules/lodash-es-proxy-1.ts",
    }),
    moduleProxy({
      target: "lodash-es",
      handler: process.cwd() + "/app/modules/lodash-es-proxy-2.ts",
    }),
    moduleProxy({
      target: "lodash-es",
      handler: "app/modules/lodash-es-proxy-3.ts",
    }),

    remixRoot({
      handler: "./app/modules/root-proxy-1.tsx",
    }),
    remixRoot({
      handler: "./app/modules/root-proxy-2.tsx",
    }),
    remixRoot({
      handler: "./app/modules/root-proxy-3.tsx",
    }),

    remixRoutes({
      handler: "./app/modules/route-proxy-1.tsx",
    }),
    remixRoutes({
      handler: "./app/modules/route-proxy-2.tsx",
    }),
    remixRoutes({
      handler: "./app/modules/route-proxy-3.tsx",
    }),

    // moduleProxy({
    //   target: "app/some-library.tsx",
    //   handler: "./app/modules/some-library-proxy-1.ts",
    // }),
    // moduleProxy({
    //   target: "app/some-library.tsx",
    //   handler: "./app/modules/some-library-proxy-2.tsx",
    // }),
    // moduleProxy({
    //   target: "app/some-library.tsx",
    //   handler: "./app/modules/some-library-proxy-3.ts",
    // }),
    // moduleProxy({
    //   target: "app/some-library.tsx",
    //   handler: "./app/modules/some-library-proxy-4.ts",
    // }),
  ],
});
