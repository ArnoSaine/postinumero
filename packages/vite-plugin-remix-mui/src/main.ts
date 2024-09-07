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
            ...((await readPackageJson("@mui/system")).version < 6
              ? { "@mui/system": "@mui/system/esm" }
              : {}),
          },
        },
        ssr: {
          noExternal: [
            // For MUI Components (Error: Element type is invalid)
            "@mui/*",
            // For Vite plugins in dev mode
            "@remix-run/*",
          ],
        },
      }),
    } as Plugin,
    // Router Link integration
    moduleProxy({
      id: "@mui/material",
      proxy: new URL("../modules/@mui/material", import.meta.url).pathname,
    }),

    // Modified Meta and RemixBrowser exports for Emotion
    moduleProxy({
      id: "@remix-run/react",
      proxy: new URL("../modules/@remix-run/react", import.meta.url).pathname,
    }),

    // For SSR & SPA
    // With Emotion cache & extract
    moduleProxy({
      id: "react-dom/server",
      proxy: new URL("../modules/react-dom/server.tsx", import.meta.url)
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
      id: `/@fs${resolvedServerEntryNode}`,
      proxy: new URL(`../modules/${serverEntryNode}`, import.meta.url).pathname,
    }),
    // For dev
    moduleProxy({
      id: resolvedServerEntryNode,
      proxy: new URL(`../modules/${serverEntryNode}`, import.meta.url).pathname,
    }),

    ...(await remixRoot({ url: import.meta.url })),
  ];
};
