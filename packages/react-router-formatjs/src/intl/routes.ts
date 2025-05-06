import {
  route,
  type RouteConfig,
  type RouteConfigEntry,
} from "@react-router/dev/routes";

export const intlRoutes = (children: RouteConfigEntry[]) =>
  [
    route(
      null,
      `${import.meta.dirname}/../routes/_intl-error-boundary.js`,
      children,
    ),
  ] satisfies RouteConfig;
