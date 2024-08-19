import createIntlConfigLoader from "./createIntlConfigLoader.js";
import { clientLoader as loadLocalePreference } from "./localePreference/methods/localStorage.client.js";
import { loadMessagesFromFetch } from "./messages.js";

export const loadClientIntlConfig = createIntlConfigLoader(
  loadLocalePreference,
  loadMessagesFromFetch,
);