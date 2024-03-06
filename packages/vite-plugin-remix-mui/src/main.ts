import moduleProxy from "@postinumero/vite-plugin-replace-module";
import remixRoot from "@postinumero/vite-plugin-replace-module/lib/presets/remix-root.js";
import type { Plugin } from "vite";

//const serverEntry = "@remix-run/dev/dist/config/defaults/entry.server";

export default [
  {
    name: "@postinumero/remix-mui",
    config: () => ({
      resolve: {
        alias: {
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
    proxy: new URL("./modules/@mui/material.js", import.meta.url).pathname,
  }),
  moduleProxy({
    id: "@remix-run/react",
    proxy: new URL("./modules/@remix-run/react.js", import.meta.url).pathname,
  }),
  // moduleProxy({
  //   id: `/node_modules/${serverEntry}.node`,
  //   proxy: new URL(`./modules/${serverEntry}.node.js`, import.meta.url)
  //     .pathname,
  // }),

  // "react-dom/server" proxy in @remix-run/dev/dist/config/defaults/entry.server.spa.tsx does not work.
  // moduleProxy({
  //   id: "react-dom/server",
  //   proxy: new URL("./modules/react-dom/server.js", import.meta.url).pathname,
  // }),
  // Replace "react-dom/server" import path with the proxy
  withResolvedConfig((configRef) => ({
    name: "@postinumero/replace-react-dom-server",
    transform(code, id) {
      if (id === configRef.current.__remixPluginContext?.entryServerFilePath) {
        return code.replace(
          "react-dom/server",
          new URL("./modules/react-dom/server.js", import.meta.url).pathname
        );
      }
    },
  })),
  ...(await remixRoot({ url: import.meta.url })),
];

function withResolvedConfig(
  createPlugin: (configRef: { current: any }) => Plugin
) {
  const configRef = { current: null as any };

  return [
    {
      name: "@postinumero/with-resolved-config",
      configResolved(resolvedConfig) {
        configRef.current = resolvedConfig;
      },
    } as Plugin,
    createPlugin(configRef),
  ];
}
