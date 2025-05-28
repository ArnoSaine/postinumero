import type { Config } from "@react-router/dev/config";

const routerConfig = await (import.meta.env && typeof process === "undefined"
  ? import("@postinumero/react-router-formatjs/react-router.config")
  : import(/* @vite-ignore */ process.cwd() + "/react-router.config.ts"));

export default routerConfig.default as Config;
