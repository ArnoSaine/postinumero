import { type LinkProps } from "react-router";
import config from "../config.ts";
import { redirectURISearchParams } from "../searchParams.ts";
import useLocationString from "../utils/react-router/useLocationString.ts";
import useIsLoginRoute from "./useIsLoginRoute.ts";

export default function useLoginLinkProps(): LinkProps {
  const locationString = useLocationString();

  // If already at the login route, link to same route
  if (useIsLoginRoute()) {
    return {
      to: locationString,
      replace: true,
    };
  }

  return {
    to: `${config.paths.login}${redirectURISearchParams(
      // If at the root (fallback) route
      locationString === config.paths.fallback
        ? // No redirect param, successful login redirects to root
          undefined
        : // Instruct to redirect back to this route after login
          locationString,
    )}`,
  };
}
