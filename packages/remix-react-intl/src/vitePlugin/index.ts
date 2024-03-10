import moduleProxy from "@postinumero/vite-plugin-replace-module";
import babelPlugin from "./babelPlugin.js";
// import compilePlugin from "./compilePlugin.js";
// import extractPlugin from "./extractPlugin.js";
import optionsPlugin, { Opts } from "./optionsPlugin.js";
import routePlugin from "./routePlugin.js";

export const name = "@postinumero/remix-react-intl";

const remixReactIntl = (_options: Opts = {}) => {
  const options = optionsPlugin(_options);

  return [
    options,
    // extractPlugin(options.api!.options),
    // compilePlugin(options.api!.options),
    babelPlugin(options.api!.options),
    moduleProxy({
      id: "/app/root.tsx",
      proxy:
        new URL("../../modules/~/route.server", import.meta.url).pathname +
        "?routeId=root",
    }),
    moduleProxy({
      id: "/app/root.tsx",
      proxy:
        new URL("../../modules/~/route", import.meta.url).pathname +
        "?routeId=root",
    }),
    moduleProxy({
      id: "___/app/routes/_index.tsx",
      proxy:
        new URL("../../modules/~/route", import.meta.url).pathname +
        "?routeId=routes._index",
    }),
    routePlugin(),
  ];
};

export default remixReactIntl;
