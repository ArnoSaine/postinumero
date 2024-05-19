import remixOidc from "@postinumero/remix-oidc";
import remixReactIntl from "@postinumero/remix-react-intl";
import mui from "@postinumero/vite-plugin-remix-mui";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

const oidc = await remixOidc();
const intl = await remixReactIntl();

export default defineConfig({
  plugins: [
    remix({
      presets: [intl.remixPreset, oidc.remixPreset],
      ssr: false,
    }),
    tsconfigPaths(),
    intl.vitePlugin,
    mui(),
    oidc.vitePlugin,
  ],
});
