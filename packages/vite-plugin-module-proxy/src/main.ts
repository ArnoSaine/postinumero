import invariant from "tiny-invariant";
import type { Plugin, ResolvedConfig } from "vite";

interface Options {
  id: string;
  reExportAllFrom?: string | false;
  proxy: string;
}

const namePrefix = "@postinumero/module-proxy/";

export default function moduleProxy({
  id,
  reExportAllFrom = id,
  proxy,
}: Options) {
  let resolvedConfig: ResolvedConfig;

  const plugin: Plugin = {
    name: `${namePrefix}${id}`,
    enforce: "pre",
    configResolved(config) {
      resolvedConfig = config;
    },
    async resolveId(source, importer, options) {
      if (source === id) {
        importer = importer?.split("?")[0];
        const proxyResolved = await this.resolve(proxy, undefined, options);

        invariant(proxyResolved, `Resolved proxy ${proxy}`);

        const proxyResolvedPathname = new URL(proxyResolved.id, import.meta.url)
          .pathname;

        if (importer === proxyResolvedPathname) {
          // Inside the proxy – do nothing and use a subsequent resolver or the
          // default.
          return;
        }

        let { plugins } = resolvedConfig;
        // Subsequent plugins
        plugins = plugins.slice(plugins.indexOf(plugin) + 1);

        for (const plugin of plugins) {
          if (plugin.resolveId) {
            // Call each `plugin.resolveId` with `null` as importer until one
            // resolves the id
            const resolved = await (plugin.resolveId as any).call(
              this,
              id,
              null, // Importer
              options,
            );
            if (resolved?.id && resolved?.id.split("?")[0]! === importer) {
              // We found a subsequent proxy that resolves to the same id that
              // imported us. Import propably happend there. To prevent infinite
              // loop, proceed to subsequent plugins.
              return;
            }
          }
        }
        // Importer is probably outside the proxies or is an earlier proxy.
        // Resolve to the proxy.

        return proxyResolved;
      }
    },
    async transform(code, _id) {
      const proxyResolved = await this.resolve(proxy?.split("?")[0]!);
      invariant(proxyResolved, `Resolved proxy ${proxy}`);

      if (
        _id.split("?")[0]! === proxyResolved.id &&
        reExportAllFrom !== false
      ) {
        // const shouldReExportDefault = async () => {
        //   const moduleInfo = this.getModuleInfo((await this.resolve(id))!.id);
        //   invariant(moduleInfo, `Module info ${id}`);

        //   // [vite] The "hasDefaultExport" property of ModuleInfo is not supported.
        //   if (moduleInfo.hasDefaultExport) {
        //     const { body } = await swc.parse(code, {
        //       syntax: "typescript", // "ecmascript" | "typescript"
        //       comments: false,
        //       script: true,
        //       tsx: true,
        //       // Defaults to es3
        //       target: "esnext",
        //     });
        //     return !body.some(
        //       (value) => value.type === "ExportDefaultDeclaration",
        //     );
        //   }
        // };
        // `export { default } from "${id}";`

        return `export * from "${reExportAllFrom}";${code}`;
      }
    },
  };

  return plugin;
}
