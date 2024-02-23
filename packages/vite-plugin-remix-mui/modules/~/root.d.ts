//declare module "virtual:remix-config-path:${path.join(config.appDirectory, config.routes.root.file)}" {
declare module "virtual:~/root" {
  export const Layout: React.ComponentType | undefined;
  export const HydrateFallback: React.ComponentType | undefined;
  const defaults: React.ComponentType;
  export default defaults;
  export const ErrorBoundary: React.ComponentType | undefined;
}
