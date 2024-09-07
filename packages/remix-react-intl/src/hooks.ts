import { options } from "@postinumero/remix-react-intl";
import { UIMatch, useMatches } from "@remix-run/react";
import { Loader } from "./route.js";

type Match = UIMatch<Loader>;

export const useDefaultLocale = () =>
  useIntlMatch().data[options._loaderDataName]!.defaultLocale;

export const useLocalePreference = () =>
  useIntlMatch().data[options._loaderDataName]!.localePreference;

export const useRequestedLocales = () =>
  useIntlMatch().data[options._loaderDataName]!.requestedLocales;

export const useIntlMatch = () =>
  useMatches().findLast(
    (match) => (match as Match).data?.[options._loaderDataName],
  ) as Match;
