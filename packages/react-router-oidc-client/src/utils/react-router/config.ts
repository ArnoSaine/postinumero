import type { Config } from "@react-router/dev/config";

const routerConfig: Config = (
  await import(/* @vite-ignore */ process.cwd() + "/react-router.config.ts")
).default;

routerConfig.ssr ??= true;

export default routerConfig;
