import { useEffect } from "react";
import { useSearchParams } from "react-router";
import options from "./options.js";

// Remove the search param in the app root.
// The loader must not remove the search param because ErrorBoundary checks the
// logout intent for protected route logouts.
export const useRemoveLogoutIntentSearchParam = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (deleteLogoutIntentParamIfExists(searchParams)) {
      setSearchParams(searchParams, {
        replace: true,
        preventScrollReset: true,
      });
    }
  }, [searchParams, setSearchParams]);
};

export function deleteLogoutIntentParamIfExists(searchParams: URLSearchParams) {
  const exists = hasLogoutIntentParam(searchParams);

  if (exists) {
    searchParams.delete(options.searchParamsAndOptions.intent.name);
  }

  return exists;
}

export const hasLogoutIntentParam = (searchParams: URLSearchParams) =>
  searchParams.get(options.searchParamsAndOptions.intent.name) ===
  options.searchParamsAndOptions.intent.values.logout;

export const setSearchParamLogoutIntent = (url: URL) =>
  url.searchParams.set(
    options.searchParamsAndOptions.intent.name,
    options.searchParamsAndOptions.intent.values.logout,
  );

export const getRedirectURI = (searchParams: URLSearchParams) =>
  searchParams.get(options.searchParamsAndOptions.redirectURI.name);

export const redirectURISearchParams = (value?: string | null) =>
  value
    ? `?${new URLSearchParams([
        [options.searchParamsAndOptions.redirectURI.name, value],
      ])}`
    : "";
