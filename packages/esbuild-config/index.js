import path from "node:path";

const config = await import(path.join(process.cwd(), "esbuild.config.js"));

export const plugins = await Promise.all(
  config.plugins?.map(async (plugin) => {
    plugin =
      typeof plugin === "string" ? (await import(plugin)).default : plugin;
    return typeof plugin === "function" ? plugin() : plugin;
  }) ?? []
);
