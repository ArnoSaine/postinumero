import moduleInfo from "@postinumero/vite-plugin-module-info";
import envOnly from "vite-env-only";
import babelPlugin from "./babelPlugin.js";
import compilePlugin from "./compilePlugin.js";
import configPlugin from "./configPlugin.js";
import extractPlugin from "./extractPlugin.js";
import optionsPlugin, { getOptions, Opts } from "./optionsPlugin.js";
import routesPlugin from "./routesPlugin.js";

export const name = "@postinumero/remix-react-intl";

const remixReactIntl = async (_options: Opts = {}) => {
  const options = optionsPlugin(_options);

  return [
    options,
    configPlugin(),
    extractPlugin(options.api!.options),
    compilePlugin(options.api!.options),
    babelPlugin(options.api!.options),
    routesPlugin(await getOptions(_options)),
    envOnly(),
    moduleInfo,
  ] as const;
};

export default remixReactIntl;
