import createIntlConfigLoader from "./createIntlConfigLoader.js";
import { loader } from "./localePreference/methods/session.server.js";
import { loadMessagesFromFile } from "./messages.server.js";

export const loadIntlConfig = createIntlConfigLoader(
  loader,
  loadMessagesFromFile,
);
