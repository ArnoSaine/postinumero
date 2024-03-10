import { OnErrorFn } from "@formatjs/intl";
import options from "@postinumero/remix-react-intl/options";
import { useLoaderData } from "@remix-run/react";
import * as React from "react";
import { IntlProvider } from "react-intl";

export function withIntlProvider<Props extends object>(
  Component: React.ComponentType<Props>,
) {
  return function WithIntlProvider(props: Props) {
    let intl;
    try {
      intl = useLoaderData();
    } catch {}

    return (
      <IntlProvider
        locale={intl?.locale ?? options.fallbackLocale}
        // TODO: fallback messages for root error boundary
        messages={intl?.messages}
        onError={handleError}
      >
        <Component {...props} />
      </IntlProvider>
    );
  };
}

const handleError = (err: Parameters<OnErrorFn>[0]) => {
  if (err.code === "MISSING_TRANSLATION") {
    return;
  }
  throw err;
};
