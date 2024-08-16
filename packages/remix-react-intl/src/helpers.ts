import "@formatjs/intl-durationformat/polyfill.js";
import { match } from "@formatjs/intl-localematcher";
import options from "virtual:@postinumero/remix-react-intl/options";
import { baseLocales } from "./utils.js";

export const availableLocale = (requestedLocales: readonly string[]) => {
  const availableLocales = [
    ...options.locales,
    // Extend available locales with base locales for better matching support.
    // E.g. match requested "sv" to available "sv-FI".
    ...options.locales.flatMap((locale) => baseLocales(locale).slice(1)),
  ];

  const locale = match(
    requestedLocales,
    availableLocales,
    options.fallbackLocale,
  );

  return options.locales.includes(locale)
    ? locale
    : options.locales.find((l) => l.startsWith(`${locale}-`))!;
};

export const defaultLocale = availableLocale(navigator.languages);
