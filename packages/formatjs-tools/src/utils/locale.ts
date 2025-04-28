import { isLeaf, toBasePaths } from "./string.ts";

export const isLocale = (locale: string) =>
  /^[a-z]{2,3}(-[A-Z]{2,4})?$/.test(locale);

export const isLeafLocale = isLeaf("-");

export const leafLocales = (locales: string[]) => locales.filter(isLeafLocale);

// "fi-FI" --> ["fi-FI", "fi"]
export const baseLocales = toBasePaths("-");
