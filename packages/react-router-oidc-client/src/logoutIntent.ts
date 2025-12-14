import { useEffect } from "react";
import { useSearchParams } from "react-router";

export const options = {
  name: "intent",
  values: {
    logout: "logout",
    logoutCallback: "logout-callback",
  },
};

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
    searchParams.delete(options.name);
  }

  return exists;
}

export const hasLogoutIntentParam = (searchParams: URLSearchParams) =>
  searchParams.get(options.name) === options.values.logout;

export const setSearchParamLogoutIntent = (url: URL) =>
  url.searchParams.set(options.name, options.values.logout);
