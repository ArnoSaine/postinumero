import moduleInfo from "@postinumero/vite-plugin-module-info";
import remixRoot from "@postinumero/vite-plugin-module-proxy/presets/remix-root";
import remixRoutes from "@postinumero/vite-plugin-module-proxy/presets/remix-routes";
import envOnly from "vite-env-only";
import babelPlugin from "./babelPlugin.js";
import compilePlugin from "./compilePlugin.js";
import extractPlugin from "./extractPlugin.js";
import optionsPlugin, { Opts } from "./optionsPlugin.js";

export const name = "@postinumero/remix-react-intl";

const remixReactIntl = async (_options: Opts = {}) => {
  const options = optionsPlugin(_options);

  return [
    options,
    extractPlugin(options.api!.options),
    compilePlugin(options.api!.options),
    babelPlugin(options.api!.options),
    ...(true //options.api!.options.singleOutput
      ? [
          await remixRoot({
            url: new URL("..", import.meta.url).toString(),
            proxy: "../modules/~/route",
          }),
        ]
      : await remixRoutes({
          url: new URL("..", import.meta.url).toString(),
        })),
    envOnly(),
    moduleInfo,
  ] as const;
};

export default remixReactIntl;
