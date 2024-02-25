import { readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import invariant from "tiny-invariant";
import type { Plugin } from "vite";

const config = await readConfig();

const prefix = "virtual:remix-resolve-config-path:";
const presetPrefix = "preset:";
const presets = {
  root: "${path.join(config.appDirectory, config.routes.root.file)}",
} as const;

const remixResolveConfigPath: Plugin = {
  name: "@postinumero/remix-resolve-config-path",
  enforce: "pre",
  resolveId(source) {
    if (source.startsWith(prefix)) {
      source = source.slice(prefix.length);

      if (source.startsWith(presetPrefix)) {
        const preset = source.slice(
          presetPrefix.length
        ) as keyof typeof presets;

        invariant(presets[preset], "preset");

        source = presets[preset];
      }

      const resolvedSource = new Function(
        "config",
        "path",
        `return \`${source}\``
      )(config, path);

      const url = new URL(resolvedSource, import.meta.url);
      url.searchParams.set("remix-resolve-config-path", "1");

      return `${url.pathname}${url.search}${url.hash}`;
    }
  },
};

export default remixResolveConfigPath;
