import { options } from "@postinumero/remix-react-intl";
import { useLoaderData } from "@remix-run/react";
import { IntlProvider, useIntl } from "react-intl";
import { useDeepCompareMemo } from "use-deep-compare";
import handleError from "./handleError.js";
import { Loader } from "./route.js";

export default function withIntlProvider<Props extends object>(
  Component: React.ComponentType<Props>,
) {
  return function WithIntlProvider(props: Props) {
    let locale = options.fallbackLocale;
    const messages = {};

    try {
      const intl = useIntl();
      if (intl.locale) {
        locale = intl.locale;
      }
      Object.assign(messages, intl.messages);
    } catch {}

    try {
      const intlConfig =
        useLoaderData<Loader>()[options._loaderDataName]!.config;
      if (intlConfig.locale) {
        locale = intlConfig.locale;
      }
      Object.assign(messages, intlConfig.messages);
    } catch {}

    const messagesMemoized = useDeepCompareMemo(() => messages, [messages]);

    return (
      <IntlProvider
        locale={locale}
        messages={messagesMemoized}
        onError={handleError}
      >
        <Component {...props} />
      </IntlProvider>
    );
  };
}
