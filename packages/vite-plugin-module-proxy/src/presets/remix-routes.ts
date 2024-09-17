import remixResolveConfigPath from "@postinumero/vite-plugin-remix-resolve-config-path";
import { readConfig } from "@remix-run/dev/dist/config.js";
import { routePlugin } from "./remix-route.js";

const remixRoutes = async ({
  handler = "../modules/~/route",
  base,
}: {
  handler?: string | Promise<string>;
  base?: string;
}) => {
  const config = await readConfig();

  return [
    remixResolveConfigPath,
    ...Object.values(config.routes).map(({ id, file }) =>
      routePlugin({ config, handler, routeId: id, base, file }),
    ),
  ];
};

export default remixRoutes;
