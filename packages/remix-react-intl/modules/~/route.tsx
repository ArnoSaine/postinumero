import { routeIdSearchParam } from "@postinumero/vite-plugin-remix-resolve-config-path/options";
import * as original from "@postinumero/vite-plugin-remix-resolve-config-path/resolve/preset/route";
import { LoaderFunction } from "@remix-run/node";
import { ClientLoaderFunction, json } from "@remix-run/react";
import { merge } from "lodash-es";
import options from "virtual:@postinumero/remix-react-intl/options";
import { url } from "virtual:@postinumero/vite-plugin-module-info";
import { serverOnly$ } from "vite-env-only";
import * as route from "../../lib/route.js";

const routeId = url.searchParams.get(routeIdSearchParam);

function createLoader(name: "loader"): LoaderFunction;
function createLoader(name: "clientLoader"): ClientLoaderFunction;
function createLoader(name: "loader" | "clientLoader") {
  return original[name]
    ? async (args) => {
        const intl = await route[name](routeId, args);

        const response = await original[name](args);
        if (response) {
          if (response instanceof Response) {
            return json(merge({ intl }, await response.json()), response);
          }
          return json(merge({ intl }, response));
        }

        return json({ intl });
      }
    : async (args) => {
        const intl = await route[name](routeId, args);

        return json({ intl });
      };
}

export const loader = serverOnly$(createLoader("loader"));

export const clientLoader = options.ssr
  ? undefined
  : Object.assign(createLoader("clientLoader"), { hydrate: true });

export const Layout = original.Layout
  ? route.withIntlProvider(original.Layout)
  : undefined;

export default original.Layout
  ? original.default
  : route.withIntlProvider(original.default);
