import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mui from "@postinumero/vite-plugin-remix-mui";
import remixReactIntl from "@postinumero/remix-react-intl/remixReactIntl";

const intl = await remixReactIntl();

export default defineConfig({
  plugins: [
    remix({
      presets: [intl.remixPreset],
      ssr: false,
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
    mui(),
    intl.vitePlugin,
  ],
});
