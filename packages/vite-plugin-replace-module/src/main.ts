import invariant from "tiny-invariant";
import type { Plugin } from "vite";

interface Options {
  id: string;
  proxy: string;
}

const name = "@postinumero/module-proxy";

export default function moduleProxy({ id, proxy }: Options) {
  const metaId = `virtual:${name}/${id}/meta`;

  return {
    name,
    enforce: "pre",
    async buildStart() {
      const proxyResolved = await this.resolve(proxy);
      invariant(proxyResolved, `Found ${proxy}`);

      const moduleInfo = await this.load({ id: metaId });
      const { proxies } = moduleInfo.meta[name];

      proxies.splice(proxies.length - 1, 0, proxyResolved.id);
    },
    async load(id) {
      if (id === metaId) {
        return {
          meta: {
            [name]: {
              proxies: [
                // From the first proxy resolve to the original id (undefined)
                undefined,
                // <List of proxies go here>
                undefined, // From anywhere else (-2) resolve to the last proxy
              ],
            },
          },
        };
      }
    },
    async resolveId(source, importer) {
      if (source === id) {
        const moduleInfo = this.getModuleInfo(metaId);
        invariant(moduleInfo, "Module info");

        const importerPath =
          importer && new URL(importer, import.meta.url).pathname;

        const { proxies } = moduleInfo.meta[name];
        return proxies.at(proxies.indexOf(importerPath) - 1);
      }
    },
  } as Plugin;
}
