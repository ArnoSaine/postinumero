import remixOidc from "@postinumero/remix-oidc";
import mui from "@postinumero/vite-plugin-remix-mui";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const oidc = await remixOidc();

export default defineConfig({
  plugins: [
    remix({
      presets: [oidc.remixPreset],
      ssr: false,
    }),
    tsconfigPaths(),
    oidc.vitePlugin,
    mui,
  ],
});
