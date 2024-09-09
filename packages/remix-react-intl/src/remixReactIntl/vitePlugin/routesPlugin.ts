import remixRoot from "@postinumero/vite-plugin-module-proxy/presets/remix-root";
import remixRoutes from "@postinumero/vite-plugin-module-proxy/presets/remix-routes";
import { Options } from "./optionsPlugin.js";

export default function routesPlugin(options: Options) {
  const url = new URL("../..", import.meta.url).toString();
  const proxy = new Promise<string>(async (resolve) => {
    resolve((await options._ssrPromise) ? "../lib/route" : "../lib/route.spa");
  });

  return options.singleOutput
    ? remixRoot({ url, proxy })
    : remixRoutes({ url, proxy });
}
