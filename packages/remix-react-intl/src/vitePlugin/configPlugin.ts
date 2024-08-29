import type { Plugin } from "vite";
import { name } from "./index.js";

const configPlugin = () => {
  return {
    name: `${name}/config`,
    config: async (config) => {
      config.optimizeDeps ??= {};
      config.optimizeDeps.exclude ??= [];
      if (!config.optimizeDeps.exclude.includes(name)) {
        // Required for loadIntl in spa mode
        config.optimizeDeps.exclude.push(name);
      }

      config.ssr ??= {};
      config.ssr.noExternal ??= [];
      if (
        Array.isArray(config.ssr.noExternal) &&
        !config.ssr.noExternal.includes(name)
      ) {
        // Required for vite-env-only macros
        config.ssr.noExternal.push(name);
      }
    },
  } as Plugin;
};

export default configPlugin;
