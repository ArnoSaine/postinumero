import { VitePluginConfig } from "@remix-run/dev";
import remixPreset from "./remixReactIntl/remixPreset.js";
import vitePlugin from "./remixReactIntl/vitePlugin/index.js";
import { Opts } from "./remixReactIntl/vitePlugin/optionsPlugin.js";

export const name = "@postinumero/remix-react-intl";

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

const remixVitePluginConfigPromiseWithResolvers =
  Promise.withResolvers<VitePluginConfig>();

export default async function remixReactIntl(options: Opts = {}) {
  const _vitePlugin = await vitePlugin(
    options,
    remixVitePluginConfigPromiseWithResolvers.promise,
  );

  return {
    remixPreset: remixPreset(remixVitePluginConfigPromiseWithResolvers.resolve),
    vitePlugin: _vitePlugin as Writeable<typeof _vitePlugin>,
  };
}
