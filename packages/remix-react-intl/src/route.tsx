import { OnErrorFn } from "@formatjs/intl";
import options from "@postinumero/remix-react-intl/options";
import serverOptions from "@postinumero/remix-react-intl/options.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import fs from "node:fs/promises";
import path from "node:path";
import * as React from "react";
import { IntlProvider, MessageFormatElement, useIntl } from "react-intl";
import { serverOnly$ } from "vite-env-only";
import { getSession } from "./sessions.js";

export const loader = serverOnly$(
  async (routeId: string, args: LoaderFunctionArgs) => {
    const session = await getSession(args.request.headers.get("Cookie"));

    let locale = session.get("locale") as string;
    if (!serverOptions.locales.includes(locale)) {
      locale = serverOptions.fallbackLocale;
    }

    const messages = JSON.parse(
      await fs.readFile(
        path.join(serverOptions.compiledTarget, locale, `${routeId}.json`),
        "utf-8",
      ),
    ) as Record<string, MessageFormatElement[]>;

    return { locale, messages };
  },
);

export function withIntlProvider<Props extends object>(
  Component: React.ComponentType<Props>,
) {
  return function WithIntlProvider(props: Props) {
    const intl = { locale: options.fallbackLocale, messages: {} };
    try {
      Object.assign(intl, useIntl());
    } catch {}
    try {
      Object.assign(intl, (useLoaderData() as any).intl);
    } catch {}

    return (
      <IntlProvider
        locale={intl.locale}
        // TODO: include fallback messages for root error boundary
        messages={intl.messages}
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
