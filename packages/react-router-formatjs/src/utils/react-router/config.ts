import type { Config } from "@react-router/dev/config";

const routerConfig = await (import.meta.env
  ? import("/react-router.config.ts")
  : import(process.cwd() + "/react-router.config.ts"));

export default routerConfig.default as Config;
