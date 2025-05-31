import { DEFAULT_INTL_CONFIG, type OnErrorFn } from "@formatjs/intl";
import { pickBy } from "lodash-es";
import { useMemo } from "react";
import type { IntlConfig } from "react-intl";
import { createIntl as _createIntl, createIntlCache } from "react-intl";

export const cache = createIntlCache();

export const handleError = (err: Parameters<OnErrorFn>[0]) => {
  // For pseudo locales
  if (err.code === "MISSING_DATA") {
    return;
  }

  if (err.code === "MISSING_TRANSLATION") {
    return;
  }

  throw err;
};

export const createIntl = (intlConfig?: IntlConfig) =>
  _createIntl(
    {
      onError: handleError,
      locale: DEFAULT_INTL_CONFIG.defaultLocale,
      messages: DEFAULT_INTL_CONFIG.messages,
      // Remove falsy values from serialised intlConfig to make sure onError is not always overridden
      ...pickBy(intlConfig, Boolean),
    },
    cache,
  );

export const useCreateIntl = (intlConfig?: IntlConfig) =>
  useMemo(() => createIntl(intlConfig), [intlConfig]);
