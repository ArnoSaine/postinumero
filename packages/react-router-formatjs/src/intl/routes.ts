import {
  layout,
  route,
  type RouteConfig,
  type RouteConfigEntry,
} from "@react-router/dev/routes";
import { CONFIG } from "../options.ts";
import routerConfig from "/react-router.config.ts";

const ssr = routerConfig.ssr ? ".ssr" : "";

const routeFile = (path: string) =>
  `${import.meta.dirname}/../routes/${path}${ssr}.js`;

export const intlRoutes = (children: RouteConfigEntry[]) =>
  [
    {
      ...layout(routeFile("options"), [
        ...children,
        route(CONFIG.route.path, routeFile("options")),
        route("*", routeFile("404")),
      ]),
      id: CONFIG.route.id,
    },
  ] satisfies RouteConfig;
