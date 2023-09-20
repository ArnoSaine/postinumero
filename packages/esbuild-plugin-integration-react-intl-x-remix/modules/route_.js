import { toModulePath } from "@postinumero/esbuild-plugin-utils";
import { readConfig } from "@remix-run/dev/dist/config.js";

const config = await readConfig();

export const as = "route";
export const originalModule = toModulePath(".", "routes/dii.tsx");
export const originalModuleFullPath = toModulePath(
  config.appDirectory,
  "routes/dii.tsx"
);
