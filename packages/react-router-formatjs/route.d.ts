import type {
  ActionFunction,
  HeadersFunction,
  LoaderFunction,
  UNSAFE_RouteModules,
} from "react-router";

export type RouteModule = NonNullable<
  UNSAFE_RouteModules[keyof UNSAFE_RouteModules]
>;

declare const action: ActionFunction | undefined;
declare const clientAction: RouteModule["clientAction"];
declare const clientLoader: RouteModule["clientLoader"];
declare const defaultExport: RouteModule["default"];
declare const ErrorBoundary: RouteModule["ErrorBoundary"];
declare const handle: RouteModule["handle"];
declare const headers: HeadersFunction | undefined;
declare const HydrateFallback: RouteModule["HydrateFallback"];
declare const Layout: RouteModule["Layout"];
declare const loader: LoaderFunction | undefined;
declare const links: RouteModule["links"];
declare const meta: RouteModule["meta"];
declare const shouldRevalidate: RouteModule["shouldRevalidate"];
declare const unstable_clientMiddleware: RouteModule["unstable_clientMiddleware"];

export {
  action,
  clientAction,
  clientLoader,
  defaultExport as default,
  ErrorBoundary,
  handle,
  headers,
  HydrateFallback,
  Layout,
  links,
  loader,
  meta,
  shouldRevalidate,
  unstable_clientMiddleware,
};
