import { VitePluginConfig } from "@remix-run/dev";
import remixPreset from "./remixPreset.js";
import vitePlugin_ from "./vitePlugin/index.js";
import { Opts } from "./vitePlugin/optionsPlugin.js";

export const name = "@postinumero/remix-react-intl";

const remixVitePluginConfigPromiseWithResolvers =
  Promise.withResolvers<VitePluginConfig>();

export default async function remixReactIntl(options: Opts = {}) {
  const vitePlugin = await vitePlugin_(
    options,
    remixVitePluginConfigPromiseWithResolvers.promise,
  );

  return {
    remixPreset: remixPreset(
      (vitePlugin[0] as any).api!.options,
      remixVitePluginConfigPromiseWithResolvers.resolve,
    ),
    vitePlugin:
      // For error "Type 'readonly ... is not assignable to type 'PluginOption'."
      [...vitePlugin],
  };
}
