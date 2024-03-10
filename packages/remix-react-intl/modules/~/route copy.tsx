import * as original from "@postinumero/vite-plugin-replace-module/original";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import routeId from "virtual:@postinumero/remix-react-intl/routeId";
import * as route from "../../lib/route.js";
import * as serverRoute from "../../lib/route.server.js";

console.log(123, routeId, original);

export * from "@postinumero/vite-plugin-replace-module/original";

export const loader = original.loader
  ? async (args: LoaderFunctionArgs) => {
      const intl = await serverRoute.loader(routeId, args);

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
      const intl = await serverRoute.loader(routeId, args);
      return json({ intl });
    };

export const Layout = original.Layout
  ? route.withIntlProvider(original.Layout)
  : undefined;

export default original.Layout
  ? original.default
  : route.withIntlProvider(original.default);
