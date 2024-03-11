import invariant from "tiny-invariant";
import type { Plugin } from "vite";

interface Options {
  id: string;
  proxy: string;
}

const namePrefix = "@postinumero/module-proxy/";
const original = "@postinumero/vite-plugin-module-proxy/original";

export default function moduleProxy({ id, proxy }: Options): Plugin {
  let proxyPlugins: Plugin[];
  let proxies: (string | undefined)[];

  return {
    name: `${namePrefix}${id}`,
    enforce: "pre",
    api: {
      id,
      proxy,
    },
    configResolved({ plugins }) {
      proxyPlugins = plugins.filter(
        (plugin) => plugin.name.startsWith(namePrefix) && plugin.api.id === id,
      );
    },
    async buildStart() {
      // List of proxies
      proxies = [
        // From the first proxy, resolve to the original id (undefined)
        undefined,
        ...(
          await Promise.all(
            proxyPlugins.map(async (plugin) => {
              const { proxy } = plugin.api;
              const proxyResolved = await this.resolve(proxy);
              invariant(proxyResolved, `Resolved proxy ${proxy}`);
              return proxyResolved;
            }),
          )
        ).map(({ id }) => id),
        undefined, // From anywhere else (-2), resolve to the last proxy
      ];
    },
    async resolveId(source, importer) {
      if (source === original) {
        const importerPath =
          importer && new URL(importer, import.meta.url).pathname;

        if (proxies.includes(importerPath)) {
          return this.resolve(id, importer, {
            skipSelf: false,
          });
        }
      }
      if (source === id) {
        const importerPath =
          importer && new URL(importer, import.meta.url).pathname;

        return proxies.at(proxies.indexOf(importerPath) - 1);
      }
    },
    async transform(code, id) {
      if (proxies.includes(id)) {
        return `export * from "${original}";${code}`;
      }
    },
  };
}
