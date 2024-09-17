export const name = "@postinumero/vite-plugin-remix-resolve-config-path";
export const routeIdSearchParam = "routeId";
export const prefix = `${name}/resolve/`;
export const presetPrefix = "preset/";
export const presets = {
  root: "${path.join(config.appDirectory, config.routes.root.file)}",
  route: `\$\{(() => {
  const routeId = new URLSearchParams(importer.split('?')[1]).get('${routeIdSearchParam}');
  if (!routeId) {
    throw Error(\`Missing search param \\\`${routeIdSearchParam}\\\` from importer \\\`\$\{importer\}\\\`. You may need to move Vite plugin \\\`${name}\\\` before other plugins.\`);
  }
  return path.join(config.appDirectory, config.routes[routeId].file);
})()\}`,
} as const;
