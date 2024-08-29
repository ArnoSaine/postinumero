import { OnErrorFn } from "@formatjs/intl";

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

export default handleError;
