import { loadIntlConfig } from "@postinumero/remix-react-intl/intlConfig";
import options from "@postinumero/remix-react-intl/options";
import withIntlProvider from "@postinumero/remix-react-intl/withIntlProvider";
import { url } from "@postinumero/vite-plugin-module-info";
import { routeIdSearchParam } from "@postinumero/vite-plugin-remix-resolve-config-path/options";
import * as original from "@postinumero/vite-plugin-remix-resolve-config-path/resolve/preset/route";
import { LoaderFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs, json } from "@remix-run/react";
import { merge } from "lodash-es";
import invariant from "tiny-invariant";

invariant(url);

const routeId = url.searchParams.get(routeIdSearchParam);

invariant(routeId);

function createLoader<Args = ClientLoaderFunctionArgs | LoaderFunctionArgs>(
  originalLoader?: (args: Args) => any,
) {
  return originalLoader
    ? async (args: Args) => {
        const intl = await (loadIntlConfig as any)(routeId, args);

        const response = await originalLoader(args);
        if (response) {
          if (response instanceof Response) {
            return json(merge({ intl }, await response.json()), response);
          }
          return json(merge({ intl }, response));
        }

        return json({ intl });
      }
    : async (args: Args) => {
        const intl = await (loadIntlConfig as any)(routeId, args);

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

const Component = original.default;

export default original.Layout
  ? original.default
  : Component && withIntlProvider(Component);
