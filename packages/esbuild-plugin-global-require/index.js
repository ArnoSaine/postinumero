import { name } from "@postinumero/esbuild-plugin-utils";

export default {
  name: await name(import.meta.url),
  async setup(build) {
    if (build.initialOptions.platform === "node") {
      build.initialOptions.banner ??= {};
      build.initialOptions.banner.js ??= "";
      build.initialOptions.banner.js = `import { createRequire } from "node:module";
global.require = createRequire(import.meta.url);
${build.initialOptions.banner.js}`;
    }
  },
};
