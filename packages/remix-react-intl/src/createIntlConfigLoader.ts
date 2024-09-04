import { LoaderFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs } from "@remix-run/react";
import availableLocale from "./availableLocale.js";
import { Messages } from "./messages.js";

export default function createIntlConfigLoader<
  Args extends LoaderFunctionArgs | ClientLoaderFunctionArgs,
>(
  loadMessages: (
    locale: string,
    routeId: string,
    args: Args,
  ) => Promise<Messages>,
  loadRequestedLocales: (args: Args) => Promise<readonly string[]>,
  loadLocalePreference: (args: Args) => Promise<string>,
) {
  return async function (routeId: string, args: Args) {
    const requestedLocales = [...(await loadRequestedLocales(args))];
    const localePreference = await loadLocalePreference(args);

    if (localePreference) {
      requestedLocales.unshift(localePreference);
    }
    const locale = availableLocale(requestedLocales);

    return { locale, messages: await loadMessages(locale, routeId, args) };
  };
}
