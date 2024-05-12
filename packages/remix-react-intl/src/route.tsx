import { OnErrorFn } from "@formatjs/intl";
import options from "@postinumero/remix-react-intl/options";
import serverOptions from "@postinumero/remix-react-intl/options.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";
import { merge } from "lodash-es";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import * as React from "react";
import { IntlProvider, MessageFormatElement, useIntl } from "react-intl";
import { serverOnly$ } from "vite-env-only";
import { getSession } from "./sessions.js";

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

const availableLocale = (locale: string) =>
  options.locales.includes(locale) ? locale : options.fallbackLocale;

const _loader = (
  generateIndexHtml
    ? serverOnly$(
        async (
          locale: string,
          routeId: string,
          _args: ClientLoaderFunctionArgs | LoaderFunctionArgs,
        ) => {
          locale = availableLocale(locale);

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
        locale: string,
        routeId: string,
        args: ClientLoaderFunctionArgs | LoaderFunctionArgs,
      ) => {
        locale = availableLocale(locale);

        const response = await fetch(
          new URL(
            `/${options.compiledTargetPublicPath}/${locale}/${routeId}.json`,
            args.request.url,
          ),
        );

        const messages: Messages = await response.json();

        return { locale, messages };
      }
)!;

export const loader = serverOnly$(
  async (routeId: string, args: LoaderFunctionArgs) => {
    const session = await getSession(args.request.headers.get("Cookie"));

    return _loader(session.get("locale")!, routeId, args);
  },
);

export const clientLoader = (
  routeId: string,
  args: ClientLoaderFunctionArgs,
) => {
  return _loader(localStorage.getItem(options.localStorageKey)!, routeId, args);
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
  // For pseudo locales
  if (err.code === "MISSING_DATA") {
    return;
  }

  if (err.code === "MISSING_TRANSLATION") {
    return;
  }

  throw err;
};
