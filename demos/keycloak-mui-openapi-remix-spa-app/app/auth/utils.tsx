import {
  ClientLoaderFunctionArgs,
  isRouteErrorResponse,
  redirect,
  useLocation,
  useNavigate,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { useLayoutEffect } from "react";
import { userManager } from ".";
// import { UserManager, WebStorageStateStore } from "oidc-client-ts";

export const logoutIntentSearchParam = { name: "intent", value: "logout" };

export function useRemoveLogoutIntentSearchParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  useLayoutEffect(() => {
    if (
      searchParams.get(logoutIntentSearchParam.name) ===
      logoutIntentSearchParam.value
    ) {
      searchParams.delete(logoutIntentSearchParam.name);
      setSearchParams(searchParams, {
        replace: true,
        preventScrollReset: true,
      });
    }
  }, [searchParams, setSearchParams]);
}

export const withRemoveLogoutIntentSearchParam = (
  Component: React.ComponentType
) =>
  function WithRemoveLogoutIntentSearchParam() {
    const error = useRouteError();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    useLayoutEffect(() => {
      if (isRouteErrorResponse(error)) {
        if (error.status === 401) {
          if (
            searchParams.get(logoutIntentSearchParam.name) ===
            logoutIntentSearchParam.value
          ) {
            navigate(
              { ...location, pathname: "/" },
              { replace: true, preventScrollReset: true }
            );
          }
        }
      }
    });

    return <Component />;
  };

const paramNames = ["code", "error", "iss", "session_state", "state"];

export const removeAuthParamsRedirect = async ({
  request,
}: ClientLoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (hasAuthParams(url)) {
    try {
      await userManager.signinCallback();
    } catch {
      /* empty */
    }
    paramNames.forEach((name) => url.searchParams.delete(name));

    throw redirect(url.toString());
  }

  return null;
};

// https://github.com/authts/react-oidc-context/blob/7a542d3e2710be1d350d66f0940f3b8ea717a388/src/utils.ts#L4
function hasAuthParams(location: URL) {
  let searchParams = location.searchParams;
  if (
    (searchParams.get("code") || searchParams.get("error")) &&
    searchParams.get("state")
  ) {
    return true;
  }
  searchParams = new URLSearchParams(location.hash.replace("#", "?"));
  if (
    (searchParams.get("code") || searchParams.get("error")) &&
    searchParams.get("state")
  ) {
    return true;
  }
  return false;
}
