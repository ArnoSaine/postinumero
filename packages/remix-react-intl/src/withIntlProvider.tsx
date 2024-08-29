import { useLoaderData } from "@remix-run/react";
import { merge } from "lodash-es";
import { useMemo } from "react";
import { IntlProvider, useIntl } from "react-intl";
import options from "virtual:@postinumero/remix-react-intl/options";
import handleError from "./handleError.js";

export default function withIntlProvider<Props extends object>(
  Component: React.ComponentType<Props>,
) {
  return function WithIntlProvider(props: Props) {
    const intl = {
      locale: options.fallbackLocale,
      messages: {},
    };

    try {
      merge(intl, useIntl());
    } catch {}

    try {
      merge(intl, (useLoaderData() as any).intl);
    } catch {}

    const intlMemoized = useMemo(() => intl, [intl.locale]);

    return (
      <IntlProvider
        locale={intlMemoized.locale}
        // TODO: include fallback messages for root error boundary
        messages={intlMemoized.messages}
        onError={handleError}
      >
        <Component {...props} />
      </IntlProvider>
    );
  };
}
