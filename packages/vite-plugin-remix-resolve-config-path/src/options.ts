export const routeIdSearchParam = "routeId";
export const prefix =
  "@postinumero/vite-plugin-remix-resolve-config-path/resolve/";
export const presetPrefix = "preset/";
export const presets = {
  root: "${path.join(config.appDirectory, config.routes.root.file)}",
  route: `\$\{path.join(config.appDirectory, config.routes[new URLSearchParams(importer.split('?')[1]).get('${routeIdSearchParam}')].file)\}`,
} as const;
