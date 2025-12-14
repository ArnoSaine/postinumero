import {
  layout,
  route,
  type RouteConfig,
  type RouteConfigEntry,
} from "@react-router/dev/routes";
import config from "./config.ts";
import routerConfig from "./utils/react-router/config.ts";

export const getAuthRoutes = (): RouteConfigEntry[] => [
  route(
    config.paths.login,
    new URL("routes/login.js", import.meta.url).pathname,
  ),
  route(
    config.paths.logout,
    new URL("routes/logout.js", import.meta.url).pathname,
  ),
  route(
    config.paths.logoutCallback,
    new URL("routes/logout-callback.js", import.meta.url).pathname,
  ),
];

export const authRoutes = getAuthRoutes();

export const defineAuthRoutes =
  ({ provider = "" } = {}) =>
  (children: RouteConfigEntry[]) =>
    [
      {
        ...layout(
          new URL(
            `${provider}routes/provider${routerConfig.ssr ? ".ssr" : ""}.js`,
            import.meta.url,
          ).pathname,
          [...children, ...getAuthRoutes()],
        ),
        id: config.route.id,
      },
    ] satisfies RouteConfig;

export const createAuthRoutes = defineAuthRoutes();
