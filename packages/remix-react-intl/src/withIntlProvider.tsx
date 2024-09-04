import { options } from "@postinumero/remix-react-intl";
import { useLoaderData } from "@remix-run/react";
import { merge } from "lodash-es";
import { useMemo } from "react";
import { IntlProvider, useIntl } from "react-intl";
import handleError from "./handleError.js";
import { Loader } from "./route.js";

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
      merge(intl, useLoaderData<Loader>().intl.config);
    } catch {}

    const intlMemoized = useMemo(() => intl, [intl.locale]);

    return (
      <IntlProvider
        locale={intlMemoized.locale}
        messages={intlMemoized.messages}
        onError={handleError}
      >
        <Component {...props} />
      </IntlProvider>
    );
  };
}
