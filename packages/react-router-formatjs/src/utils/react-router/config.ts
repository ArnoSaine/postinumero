import type { Config } from "@react-router/dev/config";

const routerConfig = await (import.meta.env
  ? import("@postinumero/react-router-formatjs/react-router.config")
  : import(process.cwd() + "/react-router.config.ts"));

export default routerConfig.default as Config;
