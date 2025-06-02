import {
  getRedirectURI,
  options,
  redirectURISearchParams,
  useLocationString,
} from "@postinumero/react-router-oidc-client";
import {
  createPath,
  type LinkProps,
  parsePath,
  useLocation,
  useSearchParams,
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
