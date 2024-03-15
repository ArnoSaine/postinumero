import { readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import invariant from "tiny-invariant";
import type { Plugin } from "vite";

const config = await readConfig();

const name = "@postinumero/remix-resolve-config-path";

const prefix = "@postinumero/vite-plugin-remix-resolve-config-path/";
const presetPrefix = "preset/";
const presets = {
  root: "${path.join(config.appDirectory, config.routes.root.file)}",
} as const;

const remixResolveConfigPath: Plugin = {
  name,
  enforce: "pre",
  async resolveId(source, importer, options) {
    if (source.startsWith(prefix)) {
      source = source.slice(prefix.length);

      if (source.startsWith(presetPrefix)) {
        const preset = source.slice(
          presetPrefix.length,
        ) as keyof typeof presets;

        invariant(presets[preset], "preset");

        source = presets[preset];
      }

      source = new Function("config", "path", `return \`${source}\``)(
        config,
        path,
      );

      const resolved = await this.resolve(source, importer, options);
      invariant(resolved, "resolved config");

      const url = new URL(resolved.id, import.meta.url);
      url.searchParams.append(name, "resolved");

      return `${url.pathname}${url.search}${url.hash}`;
    }
  },
};

export default remixResolveConfigPath;
