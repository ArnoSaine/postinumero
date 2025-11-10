import {
  asyncUserManager,
  getRedirectURI,
  options,
  redirectURISearchParams,
  useLocationString,
  useRemoveLogoutIntentSearchParam,
  useUser,
} from "@postinumero/react-router-oidc-client";
import { camelCase } from "lodash-es";
import type { ErrorResponse, UserManager } from "oidc-client-ts";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import {
  createPath,
  isRouteErrorResponse,
  type LinkProps,
  parsePath,
  useLocation,
  useRouteError,
  useSearchParams,
  useSubmit,
} from "react-router";

export function useIsLoginRoute() {
  const location = useLocation();

  return location.pathname === options.routes.login;
}

export function useLoginLinkProps(): LinkProps {
  const locationString = useLocationString();

  // If already at the login route, link to same route
  if (useIsLoginRoute()) {
    return {
      to: locationString,
      replace: true,
    };
  }

  return {
    to: `${options.routes.login}${redirectURISearchParams(
      // If at the root (fallback) route
      locationString === options.fallbackRoute
        ? // No redirect param, successful login redirects to root
          undefined
        : // Instruct to redirect back to this route after login
          locationString,
    )}`,
  };
}

export function useLoginLocation(route = options.routes.login) {
  const [searchParams] = useSearchParams();
  const locationString = useLocationString();
  const isLoginRoute = useIsLoginRoute();

  // Set redirect after successful login
  searchParams.set(
    options.searchParamsAndOptions.redirectURI.name,
    // Redirect to URI from search params
    getRedirectURI(searchParams) ??
      // If not available, use fallback
      (isLoginRoute
        ? // On login route, use fallback route option
          options.fallbackRoute
        : // Otherwise, use current route
          locationString),
  );

  return createPath({
    ...useLocation(),
    pathname: route,
    search: searchParams.toString(),
  });
}

export function useLoginLoaderLocation(data: Record<string, string>) {
  const location = parsePath(useLoginLocation(options.routes.loginLoader));

  const searchParams = new URLSearchParams(location.search);

  // Add data params
  for (const [key, value] of Object.entries(data)) {
    searchParams.append(key, value);
  }

  location.search = searchParams.toString();

  return createPath(location);
}

export function useLoginError() {
  const error = useRouteError();

  if (
    isRouteErrorResponse(error) &&
    ["invalid_grant", "unauthorized_client"].includes(error.data?.error)
  ) {
    return error.data as ErrorResponse;
  }
}

export function useLoginErrorMessage() {
  const intl = useIntl();
  const loginError = useLoginError();

  if (loginError?.error === "invalid_grant") {
    return intl.formatMessage({
      defaultMessage: "Invalid username or password",
      description: "Error message for invalid user credentials",
    });
  }
}

export type EventType =
  | "signedIn"
  | "signedOut"
  | "sessionChanged"
  | "loaded"
  | "unloaded";

const getEventName = (eventType: EventType) => (updateType: "add" | "remove") =>
  camelCase(`${updateType}-user-${eventType}`) as keyof UserManager["events"];

export function useUserEvent(
  type: EventType,
  callback: (...args: any[]) => any,
  deps?: React.DependencyList,
) {
  useEffect(() => {
    const eventName = getEventName(type);
    let shouldAddListener = true;
    (async () => {
      const userManager = await asyncUserManager.promise;
      if (!shouldAddListener) {
        return;
      }
      (userManager.events[eventName("add")] as any)(callback);
    })();
    return () => {
      (async () => {
        shouldAddListener = false;
        const userManager = await asyncUserManager.promise;
        (userManager.events[eventName("remove")] as any)(callback);
      })();
    };
  }, deps);
}

// Token refresh is not started automatically by oidc-client-ts when access token is expired
// https://github.com/authts/oidc-client-ts/issues/2012
export function useRefreshToken() {
  const loginLocation = useLoginLocation();
  const submit = useSubmit();
  const user = useUser();
  useEffect(() => {
    if (user?.expired) {
      submit({ intent: "silent" }, { action: loginLocation, method: "post" });
    }
  }, [user, loginLocation, submit]);
}

export function useOIDC() {
  useRemoveLogoutIntentSearchParam();
  useRefreshToken();
}
