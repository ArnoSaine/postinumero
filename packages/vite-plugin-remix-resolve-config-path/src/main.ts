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

      // Make this virtual module "transparent"
      // Resolve the found source using original importer and options
      const resolved = await this.resolve(source, importer, options);
      invariant(resolved, "Resolved config path");

      return resolved;
    }
  },
};

export default remixResolveConfigPath;
