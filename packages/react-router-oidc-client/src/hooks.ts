import {
  getRedirectURI,
  locationString,
  options,
  redirectURISearchParams,
  useLocationString,
} from "@postinumero/react-router-oidc-client";
import { LinkProps, useLocation, useSearchParams } from "react-router";

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
  const locationStr = useLocationString();
  const isLoginRoute = useIsLoginRoute();

  const url = new URL(route, location.toString());

  // Set redirect after successful login
  url.searchParams.set(
    options.searchParamsAndOptions.redirectURI.name,
    // Redirect to URI from search params
    getRedirectURI(searchParams) ??
      // If not available, use fallback
      (isLoginRoute
        ? // On login route, use fallback route option
          options.fallbackRoute
        : // Otherwise, use current route
          locationStr),
  );

  return locationString(url);
}

export function useLoginLoaderLocation(data: Record<string, string>) {
  const url = new URL(
    useLoginLocation(options.routes.loginLoader),
    location.toString(),
  );

  // Add data params
  for (const [key, value] of Object.entries(data)) {
    url.searchParams.append(key, value);
  }

  return locationString(url);
}
