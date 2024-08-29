import moduleInfo from "@postinumero/vite-plugin-module-info";
import { VitePluginConfig } from "@remix-run/dev";
import envOnly from "vite-env-only";
import babelPlugin from "./babelPlugin.js";
import compilePlugin from "./compilePlugin.js";
import configPlugin from "./configPlugin.js";
import extractPlugin from "./extractPlugin.js";
import optionsPlugin, { getOptions, Opts } from "./optionsPlugin.js";
import routesPlugin from "./routesPlugin.js";

export const name = "@postinumero/remix-react-intl";

const remixReactIntl = async (
  options: Opts = {},
  remixVitePluginConfigPromise: Promise<VitePluginConfig>,
) => {
  const _optionsPlugin = optionsPlugin(options, remixVitePluginConfigPromise);

  return [
    _optionsPlugin,
    configPlugin(),
    extractPlugin(_optionsPlugin.api!.options),
    compilePlugin(_optionsPlugin.api!.options),
    babelPlugin(_optionsPlugin.api!.options),
    routesPlugin(await getOptions(options)),
    envOnly(),
    moduleInfo,
  ] as const;
};

export default remixReactIntl;
