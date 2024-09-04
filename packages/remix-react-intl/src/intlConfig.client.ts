import { loadLocalePreference } from "./.client/route/localePreference.js";
import createIntlConfigLoader from "./createIntlConfigLoader.js";
import { loadMessagesFromFetch } from "./messages.js";
import { loadRequestedLocales } from "./requestedLocales.client.js";

export const loadIntlConfig = createIntlConfigLoader(
  loadMessagesFromFetch,
  loadRequestedLocales,
  loadLocalePreference,
);
