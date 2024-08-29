import remixReactIntl from "@postinumero/remix-react-intl/remixReactIntl/index";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

const intl = await remixReactIntl();

export default defineConfig({
  plugins: [
    remix({ presets: [intl.remixPreset], ssr: true }),
    tsconfigPaths(),
    intl.vitePlugin,
  ],
});
