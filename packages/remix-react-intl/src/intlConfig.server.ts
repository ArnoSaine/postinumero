import { loadLocalePreference } from "./.server/route/localePreference.js";
import createIntlConfigLoader from "./createIntlConfigLoader.js";
import { loadMessagesFromFile } from "./messages.server.js";
import { loadRequestedLocales } from "./requestedLocales.server.js";

export const loadIntlConfig = createIntlConfigLoader(
  loadMessagesFromFile,
  loadRequestedLocales,
  loadLocalePreference,
);
