import remixResolveConfigPath from "@postinumero/vite-plugin-remix-resolve-config-path";
import { readConfig } from "@remix-run/dev/dist/config.js";
import { routePlugins } from "./remix-route.js";

const remixRoutes = async ({
  proxy: proxyPromise = "../modules/~/route",
  url,
}: {
  proxy?: string | Promise<string>;
  url: string;
}) => {
  const config = await readConfig();

  const proxy = new URL(await proxyPromise, url).pathname;

  return [
    remixResolveConfigPath,
    ...Object.values(config.routes).flatMap(({ id, file }) =>
      routePlugins({ config, proxy, routeId: id, url, file }),
    ),
  ];
};

export default remixRoutes;
