import { VitePluginConfig } from "@remix-run/dev";
import invariant from "tiny-invariant";
import remixPreset from "./remixReactIntl/remixPreset.js";
import vitePlugin from "./remixReactIntl/vitePlugin/index.js";
import { Opts } from "./remixReactIntl/vitePlugin/optionsPlugin.js";

invariant(
  Promise.withResolvers,
  "Promise.withResolvers is not available. Please ensure you're using Node.js v22 or higher. If you're on an older version, you can add the necessary polyfill by importing 'core-js/proposals/promise-with-resolvers' at the top of your Vite config.",
);

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
