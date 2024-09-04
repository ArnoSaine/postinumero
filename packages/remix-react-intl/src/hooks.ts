import { UIMatch, useMatches } from "@remix-run/react";
import { Loader } from "./route.js";

type Match = UIMatch<Loader>;

export const useDefaultLocale = () => useIntlMatch().data.intl.defaultLocale;

export const useLocalePreference = () =>
  useIntlMatch().data.intl.localePreference;

export const useRequestedLocales = () =>
  useIntlMatch().data.intl.requestedLocales;

export const useIntlMatch = () =>
  useMatches().findLast((match) => (match as Match).data?.intl) as Match;
