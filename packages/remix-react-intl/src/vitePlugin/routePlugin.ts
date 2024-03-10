import type { Plugin } from "vite";
import { name } from "./index.js";

export default function routePlugin(): Plugin {
  const virtualModuleId = "virtual:@postinumero/remix-react-intl/routeId";
  const prefix = `${virtualModuleId}/`;

  return {
    name: `${name}/route`,
    enforce: "pre",
    resolveId(id, importer) {
      if (id === virtualModuleId) {
        return `${prefix}${importer?.split("?")[1]?.split("=")[1]}`;
      }
    },
    load(id) {
      if (id.startsWith(prefix)) {
        id = id.slice(prefix.length);

        return `const routeId = ${JSON.stringify(id)};
export default routeId;`;
      }
    },
  };
}
