import type { ComponentProps } from "react";
import { type IntlFormatters, FormattedDate, useIntl } from "react-intl";

const defaultOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
} as const;

export function FormattedDateTime(props: ComponentProps<typeof FormattedDate>) {
  return <FormattedDate {...defaultOptions} {...props} />;
}

export function useFormatDateTime() {
  const intl = useIntl();

  return function formatDateTime(
    ...[value, opts]: Parameters<IntlFormatters["formatDate"]>
  ) {
    return intl.formatDate(value, { ...defaultOptions, ...opts });
  };
}
