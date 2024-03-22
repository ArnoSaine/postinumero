import moduleProxy from "@postinumero/vite-plugin-module-proxy";
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
    moduleProxy({ id: "./some-library", proxy: "./app/proxy-1" }),
    moduleProxy({ id: "./some-library", proxy: "./app/proxy-2.tsx" }),
    moduleProxy({ id: "./some-library", proxy: "./app/proxy-3.ts" }),
    ...(await remixRoot({
      proxy: "./app/modules/root-proxy-1.tsx",
      url: import.meta.url,
    })),
    ...(await remixRoot({
      proxy: "./app/modules/root-proxy-2.tsx",
      url: import.meta.url,
    })),
    ...(await remixRoot({
      proxy: "./app/modules/root-proxy-3.tsx",
      url: import.meta.url,
    })),
    ...(await remixRoutes({
      proxy: "./app/modules/route-proxy-1.tsx",
      url: import.meta.url,
    })),
    ...(await remixRoutes({
      proxy: "./app/modules/route-proxy-2.tsx",
      url: import.meta.url,
    })),
    ...(await remixRoutes({
      proxy: "./app/modules/route-proxy-3.tsx",
      url: import.meta.url,
    })),
  ],
});
