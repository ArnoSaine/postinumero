import { createPath, useLocation, useSearchParams } from "react-router";
import config from "../config.ts";
import { getRedirectURI, setRedirectURI } from "../searchParams.ts";
import useLocationString from "../utils/react-router/useLocationString.ts";
import useIsLoginRoute from "./useIsLoginRoute.ts";

export default function useLoginLocation(route = config.paths.login) {
  const [searchParams] = useSearchParams();
  const locationString = useLocationString();
  const isLoginRoute = useIsLoginRoute();

  // Set redirect after successful login
  setRedirectURI(
    searchParams,
    // Redirect to URI from search params
    getRedirectURI(searchParams) ??
      // If not available, use fallback
      (isLoginRoute
        ? // On login route, use fallback route option
          config.paths.fallback
        : // Otherwise, use current route
          locationString),
  );

  return createPath({
    ...useLocation(),
    pathname: route,
    search: searchParams.toString(),
  });
}
