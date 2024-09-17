import remixRoot from "@postinumero/vite-plugin-module-proxy/presets/remix-root";
import remixRoutes from "@postinumero/vite-plugin-module-proxy/presets/remix-routes";
import { Options } from "./optionsPlugin.js";

export default function routesPlugin(options: Options) {
  const base = new URL("../..", import.meta.url).pathname;
  const handler = new Promise<string>(async (resolve) => {
    resolve((await options._ssrPromise) ? "./route" : "./route.spa");
  });

  return options.singleOutput
    ? remixRoot({ base, handler })
    : remixRoutes({ base, handler });
}
