import { toModulePath } from "@postinumero/esbuild-plugin-utils";
import { readConfig } from "@remix-run/dev/dist/config.js";

const config = await readConfig();

export const as = "root";
export const originalModule = toModulePath(".", config.routes.root.file);
export const originalModuleFullPath = toModulePath(
  config.appDirectory,
  config.routes.root.file
);
