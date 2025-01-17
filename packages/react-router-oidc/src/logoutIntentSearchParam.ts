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
    searchParams.delete(options.logoutIntentSearchParam.name);
  }

  return exists;
}

export const hasLogoutIntentParam = (searchParams: URLSearchParams) =>
  searchParams.get(options.logoutIntentSearchParam.name) ===
  options.logoutIntentSearchParam.value;
