import { OnErrorFn } from "@formatjs/intl";
import { useLoaderData } from "@remix-run/react";
import { merge } from "lodash-es";
import { readFileSync } from "node:fs";
import path from "node:path";
import { useMemo } from "react";
import { IntlProvider, useIntl } from "react-intl";
import options from "virtual:@postinumero/remix-react-intl/options";
import serverOptions from "virtual:@postinumero/remix-react-intl/options.server";
import { serverOnly$ } from "vite-env-only";
import { Messages } from "./createIntlConfigLoader.js";

const fallbackMessages = serverOnly$(
  JSON.parse(
    readFileSync(
      path.join(
        serverOptions.compiledTarget,
        options.fallbackLocale,
        "root.json",
      ),
      "utf-8",
    ),
  ) as Messages,
);

export default function withIntlProvider<Props extends object>(
  Component: React.ComponentType<Props>,
) {
  return function WithIntlProvider(props: Props) {
    const intl = {
      locale: options.fallbackLocale,
      messages: fallbackMessages ?? {},
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

const handleError = (err: Parameters<OnErrorFn>[0]) => {
  // For pseudo locales
  if (err.code === "MISSING_DATA") {
    return;
  }

  if (err.code === "MISSING_TRANSLATION") {
    return;
  }

  throw err;
};
