import { LinkProps, useLocation } from "react-router";
import options from "./options.js";
import { useLocationString } from "./utils.js";

export function useLoginLinkProps(): LinkProps {
  const location = useLocation();
  const redirectURI = useLocationString();

  // If already at the login route, link to same route
  if (location.pathname === options.routes.login) {
    return {
      to: redirectURI,
      replace: true,
    };
  }

  const searchParams = new URLSearchParams();

  // If not at the root (fallback) route
  if (redirectURI !== options.fallbackRoute) {
    // Instruct to redirect back to this route after login
    searchParams.set(options.redirectURIOptionName, redirectURI);
  }

  return {
    to: `${options.routes.login}?${searchParams}`,
  };
}
