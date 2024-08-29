import { VitePluginConfig } from "@remix-run/dev";
import remixPreset from "./remixReactIntl/remixPreset.js";
import vitePlugin from "./remixReactIntl/vitePlugin/index.js";
import { Opts } from "./remixReactIntl/vitePlugin/optionsPlugin.js";

export const name = "@postinumero/remix-react-intl";

const remixVitePluginConfigPromiseWithResolvers =
  Promise.withResolvers<VitePluginConfig>();

export default async function remixReactIntl(options: Opts = {}) {
  const _vitePlugin = await vitePlugin(
    options,
    remixVitePluginConfigPromiseWithResolvers.promise,
  );

  return {
    remixPreset: remixPreset(
      (_vitePlugin[0] as any).api!.options,
      remixVitePluginConfigPromiseWithResolvers.resolve,
    ),
    vitePlugin:
      // For error "Type 'readonly ... is not assignable to type 'PluginOption'."
      [..._vitePlugin],
  };
}
