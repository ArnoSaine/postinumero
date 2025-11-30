import type { Config } from "@react-router/dev/config";
import isVite from "../is-vite.ts";

const routerConfig = await (isVite
  ? import("@postinumero/react-router-formatjs/react-router.config")
  : import(/* @vite-ignore */ process.cwd() + "/react-router.config.ts"));

export default routerConfig.default as Config;
