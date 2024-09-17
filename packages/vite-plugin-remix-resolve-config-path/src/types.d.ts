declare module "@postinumero/vite-plugin-remix-resolve-config-path/resolve/*";

declare module "@postinumero/vite-plugin-remix-resolve-config-path/resolve/preset/route" {
  export const meta: import("@remix-run/react").MetaFunction | undefined;
  export const action: import("@remix-run/node").ActionFunction | undefined;
  export const loader: import("@remix-run/node").LoaderFunction | undefined;
  export const clientAction:
    | import("@remix-run/react").ClientActionFunction
    | undefined;
  export const clientLoader:
    | import("@remix-run/react").ClientLoaderFunction
    | undefined;
  export const shouldRevalidate:
    | import("@remix-run/react").ShouldRevalidateFunction
    | undefined;

  export const Layout: React.ComponentType<any> | undefined;
  export const HydrateFallback: React.ComponentType<any> | undefined;
  const component: React.ComponentType<any> | undefined;
  export const ErrorBoundary: React.ComponentType<any> | undefined;

  export default component;
}

declare module "@postinumero/vite-plugin-remix-resolve-config-path/resolve/preset/root" {
  export * from "@postinumero/vite-plugin-remix-resolve-config-path/resolve/preset/route";

  const component: React.ComponentType<any> | undefined;
  export default component;
}
