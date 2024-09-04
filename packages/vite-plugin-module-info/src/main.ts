import type { Plugin } from "vite";

const name = "@postinumero/vite-plugin-module-info";

const resolvedVirtualModuleId = `\0${name}/`;

const moduleInfo = {
  name,
  enforce: "pre",
  resolveId(source, importer) {
    if (source === name) {
      return `${resolvedVirtualModuleId}${importer}`;
    }
  },
  load(id) {
    if (id.startsWith(resolvedVirtualModuleId)) {
      const importer = id.slice(resolvedVirtualModuleId.length);
      return `export const importer = ${importer ? `"${importer}"` : "undefined"};
export const url = ${importer ? "new URL(importer, import.meta.url)" : "undefined"};`;
    }
  },
} as Plugin;

export default moduleInfo;
