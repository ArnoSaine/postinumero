import type { LoaderFunctionArgs } from "@remix-run/node";
import availableLocale from "../../availableLocale.js";
import { loadRequestedLocales } from "../../requestedLocales.server.js";

export const loadDefaultLocale = async (args: LoaderFunctionArgs) =>
  availableLocale(await loadRequestedLocales(args));
