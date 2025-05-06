import type { IntlConfig, OnErrorFn } from "@formatjs/intl";
import { createIntl as _createIntl, createIntlCache } from "@formatjs/intl";
import { pickBy } from "lodash-es";

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

export const createIntl = (intlConfig: IntlConfig) =>
  _createIntl(
    {
      onError: handleError,
      // Remove falsy values from serialised intlConfig to make sure onError is not always overridden
      ...(pickBy(intlConfig, Boolean) as IntlConfig),
    },
    cache,
  );
