import mui from "@postinumero/vite-plugin-remix-mui";
import moduleProxy from "@postinumero/vite-plugin-replace-module";
import remixRoot from "@postinumero/vite-plugin-replace-module/lib/presets/remix-root.js";
import { vitePlugin as remix } from "@remix-run/dev";
import { VitePluginConfig } from "@remix-run/dev/dist/vite/plugin";
import { defineConfig, Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const name = "@postinumero/replace-module";

function replacePlugin(id: string, proxy: string): Plugin {
  const metaId = `virtual:meta:${id}`;
  return {
    name,
    enforce: "pre",
    async buildStart() {
      const moduleInfo = await this.load({ id: metaId });
      const resolved = (await this.resolve(proxy))!;

      moduleInfo.meta[name].plugins.push(resolved.id);
    },
    load(id) {
      if (id === metaId) {
        return { meta: { [name]: { plugins: [] } } };
      }
    },
    async resolveId(source, importer) {
      if (source === id) {
        const moduleInfo = this.getModuleInfo(metaId);
        if (moduleInfo) {
          const { plugins } = moduleInfo.meta[name];
          if (plugins?.includes(importer)) {
            const previousPluginIndex = plugins.indexOf(importer) - 1;

            if (previousPluginIndex === -1) {
              return;
            } else {
              return plugins[previousPluginIndex];
            }
          } else {
            return plugins?.at(-1);
          }
        }
      }
    },
  };
}

export const config = (
  options: {
    remix?: VitePluginConfig;
  } = {}
) =>
  defineConfig({
    plugins: [
      remix(options.remix),
      tsconfigPaths(),
      remixRoot({ url: import.meta.url }),
      mui,
      // replacePlugin("./moo", "./app/moo-patch-1.ts"),
      // replacePlugin("./moo", "./app/moo-patch-2.ts"),
      // replacePlugin("./moo", "./app/moo-patch-3.ts"),
      moduleProxy({ id: "./moo", proxy: "./app/moo-patch-1.ts" }),
      moduleProxy({ id: "./moo", proxy: "./app/moo-patch-2.ts" }),
      moduleProxy({ id: "./moo", proxy: "./app/moo-patch-3.ts" }),
    ],
  });

export default config();
