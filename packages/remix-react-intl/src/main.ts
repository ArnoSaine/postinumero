import remixPreset from "./remixPreset.js";
import vitePlugin from "./vitePlugin/index.js";
import { Opts } from "./vitePlugin/optionsPlugin.js";

export const name = "@postinumero/remix-react-intl";

export default function remixReactIntl(options: Opts = {}) {
  return {
    remixPreset: remixPreset(),
    vitePlugin: vitePlugin(options),
  };
}
