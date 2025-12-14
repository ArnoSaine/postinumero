import type { Config } from "@react-router/dev/config";

const routerConfig: Config = (
  await import(process.cwd() + "/react-router.config.ts")
).default;

routerConfig.ssr ??= true;

export default routerConfig;
