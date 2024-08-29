import { routeIdSearchParam } from "@postinumero/vite-plugin-remix-resolve-config-path/options";
import * as original from "@postinumero/vite-plugin-remix-resolve-config-path/resolve/preset/route";
import { LoaderFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs, json } from "@remix-run/react";
import { merge } from "lodash-es";
import options from "virtual:@postinumero/remix-react-intl/options";
import { url } from "virtual:@postinumero/vite-plugin-module-info";
import loadIntlConfig from "../../lib/loadIntlConfig.js";
import withIntlProvider from "../../lib/withIntlProvider.js";

const routeId = url.searchParams.get(routeIdSearchParam);

function createLoader<Args = ClientLoaderFunctionArgs | LoaderFunctionArgs>(
  originalLoader: (args: Args) => any,
) {
  return originalLoader
    ? async (args) => {
        const intl = await loadIntlConfig(routeId, args);

        const response = await originalLoader(args);
        if (response) {
          if (response instanceof Response) {
            return json(merge({ intl }, await response.json()), response);
          }
          return json(merge({ intl }, response));
        }

        return json({ intl });
      }
    : async (args) => {
        const intl = await loadIntlConfig(routeId, args);

        return json({ intl });
      };
}

export const loader = options._ssr ? createLoader(original.loader) : undefined;

export const clientLoader = options._ssr
  ? original.clientLoader
  : Object.assign(createLoader(original.clientLoader), {
      hydrate: true,
    });

export const Layout = original.Layout
  ? withIntlProvider(original.Layout)
  : undefined;

export default original.Layout
  ? original.default
  : withIntlProvider(original.default);
