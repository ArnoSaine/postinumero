import { options, withIntlProvider } from "@postinumero/remix-react-intl";
import { url } from "@postinumero/vite-plugin-module-info";
import { routeIdSearchParam } from "@postinumero/vite-plugin-remix-resolve-config-path/options";
import * as original from "@postinumero/vite-plugin-remix-resolve-config-path/resolve/preset/route";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { ClientActionFunctionArgs, json } from "@remix-run/react";
import { merge } from "lodash-es";
import { IntlConfig } from "react-intl";
import invariant from "tiny-invariant";
import { serverOnly$ } from "vite-env-only";
import { isLocalePreferenceFormAction } from "./localePreference/LocalePreferenceForm.js";

invariant(url);

const routeId = url.searchParams.get(routeIdSearchParam);

export const clientAction = async (args: ClientActionFunctionArgs) => {
  if (isLocalePreferenceFormAction(args)) {
    return args.serverAction();
  }

  return original.clientAction?.(args);
};

export const action = serverOnly$(async (args: ActionFunctionArgs) => {
  if (isLocalePreferenceFormAction(args)) {
    await (
      await import("./.server/route/localePreference.js")
    ).actLocalePreference(args);
  }

  return original.action?.(args);
});

export const loader = serverOnly$(
  async (
    args: LoaderFunctionArgs,
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
        await import("./.server/route/defaultLocale.js")
      ).loadDefaultLocale(args),
      config: await (
        await import("./intlConfig.server.js")
      ).loadIntlConfig(routeId, args),
      localePreference: await (
        await import("./.server/route/localePreference.js")
      ).loadLocalePreference(args),
      requestedLocales: await (
        await import("./requestedLocales.server.js")
      ).loadRequestedLocales(args),
    };

    const response = original.loader && (await original.loader(args));

    if (response) {
      if (response instanceof Response) {
        return json(merge({ intl }, await response.json()), response) as any;
      }
      return merge({ intl }, response);
    }

    return { [options._loaderDataName]: intl };
  },
)!;

export type Loader = typeof loader;

export const Layout = original.Layout
  ? withIntlProvider(original.Layout)
  : undefined;

const Component = original.default;

export default original.Layout
  ? original.default
  : Component && withIntlProvider(Component);
