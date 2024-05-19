import remixPreset from "./remixPreset.js";
import vitePlugin_ from "./vitePlugin/index.js";
import { Opts } from "./vitePlugin/optionsPlugin.js";

export const name = "@postinumero/remix-react-intl";

export default async function remixReactIntl(options: Opts = {}) {
  const vitePlugin = await vitePlugin_(options);

  return {
    remixPreset: remixPreset(vitePlugin[0].api!.options),
    vitePlugin:
      // For error "Type 'readonly ... is not assignable to type 'PluginOption'."
      [...vitePlugin],
  };
}
