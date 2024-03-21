import * as original from "@postinumero/vite-plugin-remix-resolve-config-path/preset/route";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { url } from "virtual:@postinumero/vite-plugin-module-info";
import { serverOnly$ } from "vite-env-only";
import * as route from "../../lib/route.js";

const routeId = url.searchParams.get("routeId");

export const loader = serverOnly$(
  original.loader
    ? async (args: LoaderFunctionArgs) => {
        const intl = await route.loader(routeId, args);

        const response = await original.loader(args);
        if (response) {
          if (response instanceof Response) {
            return json({ ...(await response.json()), intl }, response);
          }
          return json({ ...response, intl });
        }

        return json({ intl });
      }
    : async (args: LoaderFunctionArgs) => {
        const intl = await route.loader(routeId, args);

        return json({ intl });
      },
);

export const Layout = original.Layout
  ? route.withIntlProvider(original.Layout)
  : undefined;

export default original.Layout
  ? original.default
  : route.withIntlProvider(original.default);
