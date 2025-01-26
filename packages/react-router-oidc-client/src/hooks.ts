import { LinkProps, useLocation } from "react-router";
import options from "./options.js";
import { redirectURISearchParams } from "./searchParams.js";
import { useLocationString } from "./utils.js";

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
