import { readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import invariant from "tiny-invariant";
import type { Plugin } from "vite";
import mui from "./mui.js";

const config = await readConfig();

invariant(config.routes.root?.file, "root file");

const original = path.join(config.appDirectory, config.routes.root.file);

const virtualOriginalRoot: Plugin = {
  name: `${mui.name}:virtual-original-root`,
  enforce: "pre",
  resolveId(source) {
    if (source === "virtual:~/root") {
      const url = new URL(original, import.meta.url);
      url.searchParams.set("original-root", "1");

      return `${url.pathname}${url.search}${url.hash}`;
    }
  },
};

export default virtualOriginalRoot;
