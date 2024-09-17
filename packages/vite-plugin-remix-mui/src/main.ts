import moduleProxy from "@postinumero/vite-plugin-module-proxy";
import remixRoot from "@postinumero/vite-plugin-module-proxy/presets/remix-root";
import { createRequire } from "node:module";
import type { Plugin } from "vite";
import readPackageJson from "./readPackageJson.js";

const require = createRequire(import.meta.url);

const serverEntryNode =
  "@remix-run/dev/dist/config/defaults/entry.server.node.tsx";
const serverEntrySpa =
  "@remix-run/dev/dist/config/defaults/entry.server.spa.tsx";
const resolvedServerEntryNode = require.resolve(serverEntryNode);
const resolvedServerEntrySpa = require.resolve(serverEntrySpa);

const name = "@postinumero/vite-plugin-remix-mui";

export default async () => {
  return [
    {
      name,
      config: async () => ({
        resolve: {
          alias: {
            "@mui/icons-material": "@mui/icons-material/esm",
            ...(parseInt((await readPackageJson("@mui/system")).version) < 6
              ? { "@mui/system": "@mui/system/esm" }
              : {}),
          },
        },
        ssr: {
          noExternal: [
            // For MUI Components (Error: Element type is invalid)
            "@mui/*",
            // For Vite plugins in dev mode
            "@remix-run/dev",
            "@remix-run/react",
          ],
        },
      }),
    } as Plugin,
    // Router Link integration
    moduleProxy({
      target: "@mui/material",
      handler: new URL("../modules/@mui/material", import.meta.url).pathname,
      reExportAllFrom: true,
    }),

    // Modified Meta and RemixBrowser exports for Emotion
    moduleProxy({
      target: "@remix-run/react",
      handler: new URL("../modules/@remix-run/react", import.meta.url).pathname,
      reExportAllFrom: true,
    }),

    // For SSR & SPA
    // With Emotion cache & extract
    moduleProxy({
      target: "react-dom/server",
      handler: new URL("../modules/react-dom/server.tsx", import.meta.url)
        .pathname,
    }),

    // For dev
    // "react-dom/server" proxy in @remix-run/dev/dist/config/defaults/entry.server.spa.tsx
    // does not work.
    // Replace "react-dom/server" import path with the proxy
    {
      name: `${name}/replace-react-dom-server`,
      transform(code, id) {
        if ([resolvedServerEntryNode, resolvedServerEntrySpa].includes(id)) {
          return code.replace(
            "react-dom/server",
            new URL("../modules/react-dom/server.tsx", import.meta.url)
              .pathname,
          );
        }
      },
    } as Plugin,

    // For SSR
    // Resolve final SSR entry to the proxy (The proxy then resolves to SPA server entry)
    // Emotion cache & extract requires using renderToString instead of renderToPipeableStream
    moduleProxy({
      target: `/@fs${resolvedServerEntryNode}`,
      handler: new URL(`../modules/${serverEntryNode}`, import.meta.url)
        .pathname,
      reExportAllFrom: true,
    }),
    // For dev
    moduleProxy({
      target: resolvedServerEntryNode,
      handler: new URL(`../modules/${serverEntryNode}`, import.meta.url)
        .pathname,
    }),

    ...(await remixRoot({ base: new URL(".", import.meta.url).pathname })),
  ];
};
