import { match } from "@formatjs/intl-localematcher";
import options from "@postinumero/remix-react-intl/options";
import { baseLocales } from "./utils.js";

export default function availableLocale(requestedLocales: readonly string[]) {
  const availableLocales = [
    ...options.locales,
    // Extend available locales with base locales for better matching support.
    // E.g. match requested "sv" to available "sv-FI".
    ...options.locales.flatMap((locale) => baseLocales(locale).slice(1)),
  ];

  const matchingLocale = match(
    requestedLocales,
    availableLocales,
    options.fallbackLocale,
  );

  return options.locales.includes(matchingLocale)
    ? matchingLocale
    : options.locales.find((locale) =>
        locale.startsWith(`${matchingLocale}-`),
      )!;
}
