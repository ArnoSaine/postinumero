import { readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import invariant from "tiny-invariant";
import type { Plugin } from "vite";
import { name, prefix, presetPrefix, presets } from "./options.js";

const remixResolveConfigPath: Plugin = {
  name,
  enforce: "pre",
  async resolveId(source, importer, options) {
    if (source.startsWith(prefix)) {
      const config = await readConfig();
      source = source.slice(prefix.length);

      if (source.startsWith(presetPrefix)) {
        const preset = source.slice(
          presetPrefix.length,
        ) as keyof typeof presets;

        invariant(presets[preset], "preset");

        source = presets[preset];
      }

      source = new Function(
        "config",
        "path",
        "importer",
        `return \`${source}\``,
      )(config, path, importer);

      const resolved = await this.resolve(source, importer, options);
      invariant(resolved, "resolved config");

      const url = new URL(resolved.id, import.meta.url);
      url.searchParams.append(name, "resolved");

      return `${url.pathname}${url.search}${url.hash}`;
    }
  },
};

export default remixResolveConfigPath;
