import moduleProxy from "@postinumero/vite-plugin-module-proxy";
import remixRoot from "@postinumero/vite-plugin-module-proxy/presets/remix-root";
import type { Plugin, ResolvedConfig } from "vite";

//const serverEntry = "@remix-run/dev/dist/config/defaults/entry.server";

export default async () => {
  let resolvedConfig: ResolvedConfig;

  return [
    {
      name: "@postinumero/remix-mui",
      config: () => ({
        resolve: {
          alias: {
            "@mui/icons-material": "@mui/icons-material/esm",
            "@mui/system": "@mui/system/esm",
          },
        },
        ssr: {
          noExternal: ["@mui/*", "@remix-run/*"],
        },
      }),
    } as Plugin,
    moduleProxy({
      id: "@mui/material",
      proxy: new URL("../modules/@mui/material", import.meta.url).pathname,
    }),
    moduleProxy({
      id: "@remix-run/react",
      proxy: new URL("../modules/@remix-run/react", import.meta.url).pathname,
    }),
    // moduleProxy({
    //   id: `/node_modules/${serverEntry}.node`,
    //   proxy: new URL(`./modules/${serverEntry}.node.js`, import.meta.url)
    //     .pathname,
    // }),

    // "react-dom/server" proxy in @remix-run/dev/dist/config/defaults/entry.server.spa.tsx does not work.
    // moduleProxy({
    //   id: "react-dom/server",
    //   proxy: new URL("../modules/react-dom/server.tsx", import.meta.url).pathname,
    // }),
    // Replace "react-dom/server" import path with the proxy
    {
      name: "@postinumero/remix-mui/replace-react-dom-server",
      configResolved(config) {
        resolvedConfig = config;
      },
      transform(code, id) {
        if (
          id ===
          (resolvedConfig as any).__remixPluginContext?.entryServerFilePath
        ) {
          return code.replace(
            "react-dom/server",
            new URL("../modules/react-dom/server", import.meta.url).pathname,
          );
        }
      },
    } as Plugin,
    ...(await remixRoot({ url: import.meta.url })),
  ];
};
