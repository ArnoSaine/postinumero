import * as original from "@postinumero/vite-plugin-replace-module/original";
import routeId from "virtual:@postinumero/remix-react-intl/routeId";
import * as route from "../../lib/route.js";

console.log("route", routeId, original);

export * from "@postinumero/vite-plugin-replace-module/original";

export const Layout = original.Layout
  ? route.withIntlProvider(original.Layout)
  : undefined;

export default original.Layout
  ? original.default
  : route.withIntlProvider(original.default);

export const loader = original.loader;
