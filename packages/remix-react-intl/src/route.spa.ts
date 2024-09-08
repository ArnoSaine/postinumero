import { options, withIntlProvider } from "@postinumero/remix-react-intl";
import { url } from "@postinumero/vite-plugin-module-info";
import { routeIdSearchParam } from "@postinumero/vite-plugin-remix-resolve-config-path/options";
import * as original from "@postinumero/vite-plugin-remix-resolve-config-path/resolve/preset/route";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  json,
} from "@remix-run/react";
import { merge } from "lodash-es";
import { IntlConfig } from "react-intl";
import invariant from "tiny-invariant";
import { isLocalePreferenceFormAction } from "./localePreference/LocalePreferenceForm.js";

invariant(url);

const routeId = url.searchParams.get(routeIdSearchParam);

export const clientAction = async (args: ClientActionFunctionArgs) => {
  if (isLocalePreferenceFormAction(args)) {
    await (
      await import("./.client/route/localePreference.js")
    ).actLocalePreference(args);

    return null;
  }

  return original.clientAction?.(args);
};

export const clientLoader = async (
  args: ClientLoaderFunctionArgs,
): Promise<{
  [_loaderDataName: string]: {
    defaultLocale: string;
    config: IntlConfig;
    localePreference: string;
    requestedLocales: readonly string[];
  };
}> => {
  invariant(routeId);

  const intl = {
    defaultLocale: await (
      await import("./.client/route/defaultLocale.js")
    ).loadDefaultLocale(args),
    config: await (
      await import("./intlConfig.client.js")
    ).loadIntlConfig(routeId, args),
    localePreference: await (
      await import("./.client/route/localePreference.js")
    ).loadLocalePreference(args),
    requestedLocales: await (
      await import("./requestedLocales.client.js")
    ).loadRequestedLocales(args),
  };

  const response = original.clientLoader && (await original.clientLoader(args));

  if (response) {
    if (response instanceof Response) {
      return json(merge({ intl }, await response.json()), response) as any;
    }
    return merge({ intl }, response);
  }

  return { [options._loaderDataName]: intl };
};

export type ClientLoader = typeof clientLoader;

export const Layout = original.Layout
  ? withIntlProvider(original.Layout)
  : undefined;

const Component = original.default;

export default original.Layout
  ? original.default
  : Component && withIntlProvider(Component);
