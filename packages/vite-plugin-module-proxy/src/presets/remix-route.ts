import remixResolveConfigPath from "@postinumero/vite-plugin-remix-resolve-config-path";
import { RemixConfig, readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import invariant from "tiny-invariant";
import moduleProxy from "../main.js";

const remixRoute = async ({
  proxy = "../modules/~/route",
  url,
  routeId,
}: {
  proxy?: string;
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
  proxy,
  url,
  file,
  routeId,
}: {
  config: RemixConfig;
  proxy: string;
  url: string;
  file: string;
  routeId: string;
}) => {
  const proxyURL = new URL(
    `${proxy}${proxy.includes("?") ? "&" : "?"}${`routeId=${encodeURIComponent(routeId).replaceAll(".", "%2E")}`}`,
    url,
  );

  proxy = proxyURL.pathname + proxyURL.search;

  return [
    moduleProxy({
      id:
        // "/absolute/path/to/app/<route file>.tsx"
        new URL(path.join(config.appDirectory, file), url).pathname,
      reExportAllFrom: `@postinumero/vite-plugin-remix-resolve-config-path/\$\{path.join(config.appDirectory, config.routes['${routeId}'].file)\}`,
      proxy,
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
      proxy,
    }),
    moduleProxy({
      id:
        // "./<route file>.tsx"
        `.${new URL(path.join(" ", file), url).pathname}`,
      reExportAllFrom: false,
      proxy,
    }),
  ];
};
