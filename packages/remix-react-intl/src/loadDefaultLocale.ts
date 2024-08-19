import type { LoaderFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs } from "@remix-run/react";
import availableLocale from "./availableLocale.js";
import loadRequestedLocales from "./loadRequestedLocales.js";

const loadDefaultLocale = (
  args: ClientLoaderFunctionArgs | LoaderFunctionArgs,
) => availableLocale(loadRequestedLocales(args as LoaderFunctionArgs));

export default loadDefaultLocale;
