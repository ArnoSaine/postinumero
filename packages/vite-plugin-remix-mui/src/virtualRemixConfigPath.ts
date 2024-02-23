import { readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import type { Plugin } from "vite";
import mui from "./mui.js";

// Allows imports from Remix config paths
// Example, root file;
// import * as root from "virtual:remix-config-path:${path.join(config.appDirectory, config.routes.root.file)}";

const config = await readConfig();

const virtualRemixConfigPath: Plugin = {
  name: `${mui.name}:virtual-remix-config-path`,
  enforce: "pre",
  resolveId(source) {
    const prefix = "virtual:remix-config-path:";
    if (source.startsWith(prefix)) {
      const resolvedSource = new Function(
        "config",
        "path",
        `return \`${source.slice(prefix.length)}\``
      )(config, path);

      const url = new URL(resolvedSource, import.meta.url);
      url.searchParams.set("remix-config-path-resolved", "1");

      return `${url.pathname}${url.search}${url.hash}`;
    }
  },
};

export default virtualRemixConfigPath;
