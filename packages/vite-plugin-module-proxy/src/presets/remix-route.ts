import remixResolveConfigPath from "@postinumero/vite-plugin-remix-resolve-config-path";
import { routeIdSearchParam } from "@postinumero/vite-plugin-remix-resolve-config-path/options";
import { RemixConfig, readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import invariant from "tiny-invariant";
import moduleProxy from "../main.js";

const remixRoute = async ({
  proxy = "../modules/~/route",
  url,
  routeId,
}: {
  proxy?: string | Promise<string>;
  url: string;
  routeId: string;
}) => {
  const config = await readConfig();

  const file = config.routes[routeId]?.file;

  invariant(file, "route file");

  return [
    remixResolveConfigPath,
    ...routePlugins({
      config,
      proxy,
      url,
      file,
      routeId,
    }),
  ];
};

export default remixRoute;

export const routePlugins = ({
  config,
  proxy: proxyPromise,
  url,
  file,
  routeId,
}: {
  config: RemixConfig;
  proxy: string | Promise<string>;
  url: string;
  file: string;
  routeId: string;
}) => {
  proxyPromise = new Promise(async (resolve) => {
    const proxy = await proxyPromise;
    const proxyURL = new URL(
      `${proxy}${proxy.includes("?") ? "&" : "?"}${`${routeIdSearchParam}=${encodeURIComponent(routeId).replaceAll(".", "%2E")}`}`,
      url,
    );
    resolve(proxyURL.pathname + proxyURL.search);
  });

  return [
    moduleProxy({
      id:
        // "/absolute/path/to/app/<route file>.tsx"
        new URL(path.join(config.appDirectory, file), url).pathname,
      reExportAllFrom: `@postinumero/vite-plugin-remix-resolve-config-path/resolve/\$\{path.join(config.appDirectory, config.routes['${routeId}'].file)\}`,
      proxy: proxyPromise,
    }),
    moduleProxy({
      id:
        // TODO: Figure out if this actually relative to cwd?
        // "/app/<route file>.tsx"
        new URL(
          path.join(
            " ",
            path.relative(config.rootDirectory, config.appDirectory),
            file,
          ),
          url,
        ).pathname,
      reExportAllFrom: false,
      proxy: proxyPromise,
    }),
    moduleProxy({
      id:
        // "./<route file>.tsx"
        `.${new URL(path.join(" ", file), url).pathname}`,
      reExportAllFrom: false,
      proxy: proxyPromise,
    }),
  ];
};
