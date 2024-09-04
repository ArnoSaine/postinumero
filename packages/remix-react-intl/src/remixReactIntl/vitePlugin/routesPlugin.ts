import remixRoot from "@postinumero/vite-plugin-module-proxy/presets/remix-root";
import remixRoutes from "@postinumero/vite-plugin-module-proxy/presets/remix-routes";
import { Options } from "./optionsPlugin.js";

export default function routesPlugin(options: Options) {
  return options.singleOutput
    ? remixRoot({
        url: new URL("../..", import.meta.url).toString(),
        proxy: new Promise(async (resolve) => {
          resolve(
            (await options._ssrPromise) ? "../lib/route" : "../lib/route.spa",
          );
        }),
      })
    : remixRoutes({
        url: new URL("../..", import.meta.url).toString(),
        proxy: "../lib/route",
      });
}
