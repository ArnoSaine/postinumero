import { useMemo } from "react";
import { useIntl } from "react-intl";

// "fi-FI" --> ["fi-FI", "fi"]
export const baseLocales = (locale: string) =>
  locale
    .split("-")
    .map((_part, index, localeParts) =>
      localeParts.slice(0, index + 1).join("-"),
    )
    .reverse();

export function useIntlDurationFormat(options: Record<string, string>) {
  const { locale } = useIntl();

  return useMemo(
    () => new (Intl as any).DurationFormat(locale, options),
    [locale, ...Object.values(options)],
  );
}
