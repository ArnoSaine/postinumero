import type { Plugin } from "vite";
import mui from "./mui.js";

export default function modulePlugins(
  plugins: (
    | string
    | {
        source: string;
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
      source,
      pathname: new URL(`../modules/${pathname}`, import.meta.url).pathname,
    }));

  return {
    name: `${mui.name}:module-plugins`,
    enforce: "pre",
    resolveId(source, importer) {
      return pluginsNormalized.find(
        (plugin) => source === plugin.source && importer !== plugin.pathname
      )?.pathname;
    },
  };
}
