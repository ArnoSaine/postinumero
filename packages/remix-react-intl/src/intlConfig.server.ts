import path from "node:path";
import createIntlConfigLoader from "./createIntlConfigLoader.js";
import { loader as loadLocalePreference } from "./localePreference/methods/session.server.js";
import { loadMessagesFromFetch } from "./messages.js";
import { loadMessagesFromFile } from "./messages.server.js";

const generateIndexHtml =
  import.meta.url ===
  new URL(path.resolve("build/server/index.js"), import.meta.url).toString();

export const loadIntlConfig = generateIndexHtml
  ? createIntlConfigLoader(loadLocalePreference, loadMessagesFromFile)
  : createIntlConfigLoader(loadLocalePreference, loadMessagesFromFetch);
