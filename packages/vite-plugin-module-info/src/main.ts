import type { Plugin } from "vite";

const name = "virtual:@postinumero/vite-plugin-module-info";

const resolvedVirtualModuleId = `\0${name}/`;

const moduleInfo = {
  name,
  resolveId(source, importer) {
    if (source === name) {
      return `${resolvedVirtualModuleId}${importer}`;
    }
  },
  load(id) {
    if (id.startsWith(resolvedVirtualModuleId)) {
      const importer = id.slice(resolvedVirtualModuleId.length);
      return `export const importer = "${importer}";
export const url = importer && new URL(importer, import.meta.url);`;
    }
  },
} as Plugin;

export default moduleInfo;
