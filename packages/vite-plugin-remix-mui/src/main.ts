import { readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import invariant from "tiny-invariant";
import modulePlugins from "./modulePlugins.js";
import mui from "./mui.js";
import virtualRoot from "./virtualRoot.js";

const config = await readConfig();

invariant(config.routes.root?.file, "root file");

const serverEntry = "@remix-run/dev/dist/config/defaults/entry.server.node.tsx";

export default [
  mui,
  modulePlugins([
    "@mui/material",
    "@remix-run/react",
    {
      source: `/node_modules/${serverEntry}`,
      pathname: serverEntry,
    },
    {
      source: [
        // "/app/root.tsx"
        new URL(
          path.join(
            " ",
            path.relative(config.rootDirectory, config.appDirectory),
            config.routes.root.file
          ),
          import.meta.url
        ).pathname,
        // "./root.tsx"
        `.${
          new URL(path.join(" ", config.routes.root.file), import.meta.url)
            .pathname
        }`,
      ],
      pathname: "~/root.tsx",
    },
  ]),
  virtualRoot,
];
