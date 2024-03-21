declare module "@postinumero/vite-plugin-remix-resolve-config-path/*";

const meta: import("@remix-run/react").MetaFunction;
const action: import("@remix-run/node").ActionFunction;
const loader: import("@remix-run/node").LoaderFunction;
const clientAction: import("@remix-run/react").ClientActionFunction;
const clientLoader: import("@remix-run/react").ClientLoaderFunction;
const shouldRevalidate: import("@remix-run/react").ShouldRevalidateFunction;

const Layout: React.ComponentType | undefined;
const HydrateFallback: React.ComponentType | undefined;
const component: React.ComponentType;
const ErrorBoundary: React.ComponentType | undefined;

declare module "@postinumero/vite-plugin-remix-resolve-config-path/preset/root" {
  export {
    ErrorBoundary,
    HydrateFallback,
    Layout,
    action,
    clientAction,
    clientLoader,
    component as default,
    loader,
    meta,
    shouldRevalidate,
  };
}

declare module "@postinumero/vite-plugin-remix-resolve-config-path/preset/route" {
  export {
    ErrorBoundary,
    HydrateFallback,
    Layout,
    action,
    clientAction,
    clientLoader,
    component as default,
    loader,
    meta,
    shouldRevalidate,
  };
}
