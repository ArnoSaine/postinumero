import { match as _match } from "@formatjs/intl-localematcher";
import { baseLocales } from "@postinumero/formatjs-tools/utils/locale";

export const match: typeof _match = (
  requestedLocales,
  availableLocales,
  defaultLocale,
  opts,
) => {
  let matchingLocale = _match(
    requestedLocales,
    [
      ...availableLocales,
      // Extend available locales with base locales for better matching support.
      // E.g. match requested "sv" to available "sv-FI".
      ...availableLocales.flatMap((locale) => baseLocales(locale).slice(0, -1)),
    ],
    defaultLocale,
    opts,
  );

  // Some match implementations return the default locale if no match is found.
  // Prefer any matching locale with region over the default.
  return availableLocales.includes(matchingLocale)
    ? matchingLocale
    : (availableLocales.find((locale) =>
        locale.startsWith(`${matchingLocale}-`),
      ) ??
        availableLocales.at(0) ??
        defaultLocale);
};
