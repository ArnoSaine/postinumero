import type { Plugin } from "vite";
import mui from "./mui.js";

export default function modulePlugins(
  plugins: (
    | string
    | {
        source: string | string[];
        pathname: string;
      }
  )[]
): Plugin {
  const pluginsNormalized = plugins
    .map((modulePlugin) =>
      typeof modulePlugin === "string"
        ? { source: modulePlugin, pathname: `${modulePlugin}.tsx` }
        : modulePlugin
    )
    .map(({ source, pathname }) => ({
      source: Array.isArray(source) ? source : [source],
      pathname: new URL(`../modules/${pathname}`, import.meta.url).pathname,
    }));

  return {
    name: `${mui.name}:module-plugins`,
    enforce: "pre",
    resolveId(source, importer) {
      return pluginsNormalized.find(
        (plugin) =>
          plugin.source.includes(source) && importer !== plugin.pathname
      )?.pathname;
    },
  };
}
