import { OnErrorFn } from "@formatjs/intl";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";
import { memoize, merge } from "lodash-es";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { useMemo } from "react";
import { IntlProvider, MessageFormatElement, useIntl } from "react-intl";
import options from "virtual:@postinumero/remix-react-intl/options";
import serverOptions from "virtual:@postinumero/remix-react-intl/options.server";
import { serverOnly$ } from "vite-env-only";
import { availableLocale } from "./helpers.js";
import loadLocalePreference from "./loadLocalePreference.js";

type Messages = Record<string, MessageFormatElement[]>;

const fallbackIntl = {
  locale: options.fallbackLocale,
  messages: JSON.parse(
    readFileSync(
      path.join(
        serverOptions.compiledTarget,
        options.fallbackLocale,
        "root.json",
      ),
      "utf-8",
    ),
  ) as Messages,
};

const generateIndexHtml =
  import.meta.url ===
  serverOnly$(() =>
    new URL(path.resolve("build/server/index.js"), import.meta.url).toString(),
  )?.();

const fetchMemoizedMessages = memoize(
  async (url: string): Promise<Messages> => {
    const response = await fetch(new URL(url));

    return response.json();
  },
);

const _loader = (
  generateIndexHtml
    ? serverOnly$(
        async (
          requestedLocales: string[],
          routeId: string,
          _args: ClientLoaderFunctionArgs | LoaderFunctionArgs,
        ) => {
          const locale = availableLocale(requestedLocales);

          return {
            locale,
            messages: JSON.parse(
              await readFile(
                path.join(
                  serverOptions.compiledTarget,
                  locale,
                  `${routeId}.json`,
                ),
                "utf-8",
              ),
            ) as Messages,
          };
        },
      )
    : async (
        requestedLocales: string[],
        routeId: string,
        args: ClientLoaderFunctionArgs | LoaderFunctionArgs,
      ) => {
        const locale = availableLocale(requestedLocales);

        const messages = await fetchMemoizedMessages(
          new URL(
            `/${options.compiledTargetPublicPath}/${locale}/${routeId}.json`,
            args.request.url,
          ).toString(),
        );

        return { locale, messages };
      }
)!;

export const loader = serverOnly$(
  async (routeId: string, args: LoaderFunctionArgs) => {
    const requestedLocales = [];

    const localePreference = await loadLocalePreference(args);
    if (localePreference) {
      requestedLocales.push(localePreference);
    }

    return _loader(requestedLocales, routeId, args);
  },
);

export const clientLoader = async (
  routeId: string,
  args: ClientLoaderFunctionArgs,
) => {
  const requestedLocales = [...navigator.languages];

  const localePreference = await loadLocalePreference(undefined as any);
  if (localePreference) {
    requestedLocales.unshift(localePreference);
  }

  return _loader(requestedLocales, routeId, args);
};

export function withIntlProvider<Props extends object>(
  Component: React.ComponentType<Props>,
) {
  return function WithIntlProvider(props: Props) {
    const intl = {
      locale: options.fallbackLocale,
      messages: {},
    };
    merge(intl, serverOnly$(fallbackIntl));

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
