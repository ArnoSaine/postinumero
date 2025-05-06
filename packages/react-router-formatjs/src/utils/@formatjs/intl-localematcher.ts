import { match as _match } from "@formatjs/intl-localematcher";
import { baseLocales } from "@postinumero/formatjs-tools/utils/locale";
import invariant from "tiny-invariant";

export const match: typeof _match = (
  requestedLocales,
  availableLocales,
  ...other
) => {
  let matchingLocale = _match(
    requestedLocales,
    [
      ...availableLocales,
      // Extend available locales with base locales for better matching support.
      // E.g. match requested "sv" to available "sv-FI".
      ...availableLocales.flatMap((locale) => baseLocales(locale).slice(0, -1)),
    ],
    ...other,
  );

  // Some match implementations return the default locale if no match is found.
  // E.g. match requested "en" to available ["en-US"] when default is "en".
  const availableLocale = availableLocales.includes(matchingLocale)
    ? matchingLocale
    : (availableLocales.find((locale) =>
        locale.startsWith(`${matchingLocale}-`),
      ) ?? availableLocales.at(0));

  invariant(availableLocale, "No available locale found");

  return availableLocale;
};
