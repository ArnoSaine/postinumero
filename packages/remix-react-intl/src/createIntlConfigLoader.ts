import { LoaderFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs } from "@remix-run/react";
import availableLocale from "./availableLocale.js";
import { Messages } from "./messages.js";
import { loadRequestedLocales } from "./requestedLocales.js";

export default function createIntlConfigLoader<
  Args = LoaderFunctionArgs | ClientLoaderFunctionArgs,
>(
  loadLocalePreference:
    | ((args: Args) => string | Promise<string>)
    | ((args?: Args) => string | Promise<string>),
  loadMessages: (
    locale: string,
    routeId: string,
    args: Args,
  ) => Promise<Messages>,
) {
  return async function (routeId: string, args: Args) {
    const _requestedLocales = [...(await (loadRequestedLocales as any)(args))];
    const localePreference = await loadLocalePreference(args);

    if (localePreference) {
      _requestedLocales.unshift(localePreference);
    }
    const locale = availableLocale(_requestedLocales);

    return { locale, messages: await loadMessages(locale, routeId, args) };
  };
}
