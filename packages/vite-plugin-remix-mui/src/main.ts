import replaceModule from "@postinumero/vite-plugin-replace-module";
import remixRoot from "@postinumero/vite-plugin-replace-module/lib/presets/remix-root.js";
import type { Plugin } from "vite";

const serverEntry = "@remix-run/dev/dist/config/defaults/entry.server.node";

export default [
  {
    name: "@postinumero/remix-mui",
    config: (config) => {
      const onwarn =
        config.build?.rollupOptions?.onwarn ??
        ((warning, warn) => warn(warning));

      config.build ??= {};
      config.build.rollupOptions ??= {};
      config.build.rollupOptions.onwarn = (warning, warn) => {
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.id?.includes("/node_modules/@mui/") &&
          warning.message.includes('"use client"')
        ) {
          return;
        }

        onwarn(warning, warn);
      };

      return {
        resolve: {
          alias: [
            {
              find: "@mui/system",
              replacement: "@mui/system/esm",
            },
          ],
        },
        ssr: {
          noExternal: ["@mui/*", "@remix-run/*"],
        },
      };
    },
  } as Plugin,
  replaceModule([
    {
      source: "@mui/material",
      pathname: new URL("./modules/@mui/material.js", import.meta.url).pathname,
    },
    {
      source: "@remix-run/react",
      pathname: new URL("./modules/@remix-run/react.js", import.meta.url)
        .pathname,
    },
    {
      source: `/node_modules/${serverEntry}`,
      pathname: new URL(`./modules/${serverEntry}.js`, import.meta.url)
        .pathname,
    },
  ]),
  remixRoot({ url: import.meta.url }),
];
