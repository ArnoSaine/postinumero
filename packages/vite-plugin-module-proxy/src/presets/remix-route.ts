import remixResolveConfigPath from "@postinumero/vite-plugin-remix-resolve-config-path";
import { routeIdSearchParam } from "@postinumero/vite-plugin-remix-resolve-config-path/options";
import { RemixConfig, readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import invariant from "tiny-invariant";
import { Plugin } from "vite";
import moduleProxy from "../main.js";

const remixRoute = async ({
  handler = "../modules/~/route",
  base,
  routeId,
}: {
  handler?: string | Promise<string>;
  base?: string;
  routeId: string;
}) => {
  const config = await readConfig();

  const file = config.routes[routeId]?.file;

  invariant(file, "route file");

  return [
    remixResolveConfigPath,
    routePlugin({
      config,
      handler,
      base,
      file,
      routeId,
    }),
  ];
};

export default remixRoute;

export const routePlugin = ({
  config,
  handler: handlerPromise,
  base,
  file,
  routeId,
}: {
  config: RemixConfig;
  handler: string | Promise<string>;
  base?: string;
  file: string;
  routeId: string;
}): Plugin => {
  handlerPromise = new Promise(async (resolve) => {
    const handler = await handlerPromise;

    resolve(
      `${handler}${handler.includes("?") ? "&" : "?"}${`${routeIdSearchParam}=${encodeURIComponent(routeId).replaceAll(".", "%2E")}`}`,
    );
  });

  // "/absolute/path/to/app/<route file>.tsx"
  const absoluteRoutePath = path.join(config.appDirectory, file);

  // "/app/<route file>.tsx"
  const appRoutePath = new URL(
    path.join(
      " ",
      path.relative(config.rootDirectory, config.appDirectory),
      file,
    ),
    import.meta.url,
  ).pathname;

  // "./routes/<route file>.tsx"
  const routePath = `.${new URL(path.join(" ", file), import.meta.url).pathname}`;

  const plugin = moduleProxy({
    handler: handlerPromise,
    target: [absoluteRoutePath, appRoutePath, routePath],
    base,
  });

  return {
    ...plugin,
    resolveId(source, importer, options) {
      const [importerPathname, importerSearch] = importer?.split("?") ?? [];

      // Convert filenames relative to ./app/
      // "./_index.tsx" --> "./routes/_index.tsx"
      // "./route.tsx" --> "./routes/foo/route.tsx"
      if (
        importerPathname === absoluteRoutePath &&
        importerSearch === "__remix-build-client-route"
      ) {
        source = routePath;
      }

      return (
        typeof plugin.resolveId === "function" &&
        plugin.resolveId.call(this, source, importer, options)
      );
    },
  };
};
