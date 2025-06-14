import { type IntlFormatters, useIntl } from "react-intl";

type Params = Parameters<IntlFormatters["formatMessage"]>;

export function useFormatMessageNoFallbackOnMissingString(...params: Params) {
  const [message, values, opts] = params;
  const intl = useIntl();

  if (intl.messages[message.id!]) {
    return intl.formatMessage(message, values as any, opts);
  }

  return "";
}
