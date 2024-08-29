import type { LoaderFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs } from "@remix-run/react";
import availableLocale from "./availableLocale.js";
import { loadRequestedLocales } from "./requestedLocales.js";

export const loadDefaultLocale = async (
  args: ClientLoaderFunctionArgs | LoaderFunctionArgs,
) => availableLocale(await loadRequestedLocales(args as LoaderFunctionArgs));
