import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import availableLocale from "../../availableLocale.js";
import { loadRequestedLocales } from "../../requestedLocales.client.js";

export const loadDefaultLocale = async (args: ClientLoaderFunctionArgs) =>
  availableLocale(await loadRequestedLocales(args));
