declare module "@postinumero/vite-plugin-remix-resolve-config-path/*";

declare module "@postinumero/vite-plugin-remix-resolve-config-path/preset/root" {
  export const meta: import("@remix-run/react").MetaFunction;
  export const action: import("@remix-run/node").ActionFunction;
  export const loader: import("@remix-run/node").LoaderFunction;
  export const clientAction: import("@remix-run/react").ClientActionFunction;
  export const clientLoader: import("@remix-run/react").ClientLoaderFunction;
  export const shouldRevalidate: import("@remix-run/react").ShouldRevalidateFunction;

  export const Layout: React.ComponentType | undefined;
  export const HydrateFallback: React.ComponentType | undefined;
  const defaults: React.ComponentType;
  export default defaults;
  export const ErrorBoundary: React.ComponentType | undefined;
}
