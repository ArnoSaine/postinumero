import { useEffect } from "react";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
  useSearchParams,
} from "react-router";
import useUserMonitor from "../client/hooks/useUserMonitor.ts";
import config from "../config.ts";
import { hasLogoutIntentParam } from "../logoutIntent.ts";
import { tokenVerifyErrorCode } from "../user/getUserFromRequest.ts";
import TrySigninSilent from "./TrySigninSilent.tsx";

export const next_withAuthErrorBoundary = (
  ErrorBoundary: React.ComponentType<any>,
  {
    VerifyToken = () => null,
    UnauthorizedWhileLogout = () => null,
    Unauthorized = () => null,
  }: {
    VerifyToken?: React.ComponentType<any>;
    UnauthorizedWhileLogout?: React.ComponentType<any>;
    Unauthorized?: React.ComponentType<any>;
  } = {},
) =>
  function WithAuthErrorBoundary(props: any) {
    const isLoggingOutProtectedRoute = useHandleLogoutProtectedRoute();
    const isUnauthorizedRouteError = useIsUnauthorizedRouteError();
    useUserMonitor();

    if (isLoggingOutProtectedRoute) {
      return <UnauthorizedWhileLogout {...props} />;
    }

    if (isUnauthorizedRouteError) {
      // Server was unable to verify token. Try silent sign-in.
      if (props.error?.data?.code === tokenVerifyErrorCode) {
        return (
          <TrySigninSilent>
            <VerifyToken {...props} />
          </TrySigninSilent>
        );
      }

      return <Unauthorized {...props} />;
    }

    return <ErrorBoundary {...props} />;
  };

/**
 * @deprecated Use `withAuthErrorBoundary` with the new signature instead.
 */
const legacy_withAuthErrorBoundary = (
  Unauthorized: React.ComponentType<any>,
  ErrorBoundary: React.ComponentType<any>,
) =>
  next_withAuthErrorBoundary(ErrorBoundary, {
    Unauthorized,
    VerifyToken: Unauthorized,
  });

export function withAuthErrorBoundary(
  ...args:
    | Parameters<typeof legacy_withAuthErrorBoundary>
    | Parameters<typeof next_withAuthErrorBoundary>
) {
  if (typeof args[1] === "function") {
    return legacy_withAuthErrorBoundary(
      ...(args as Parameters<typeof legacy_withAuthErrorBoundary>),
    );
  } else {
    return next_withAuthErrorBoundary(
      ...(args as Parameters<typeof next_withAuthErrorBoundary>),
    );
  }
}

export function useIsUnauthorizedRouteError() {
  const error = useRouteError();

  return isRouteErrorResponse(error) && error.status === 401;
}

export function useHandleLogoutProtectedRoute() {
  const isUnauthorized = useIsUnauthorizedRouteError();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isLoggingOut = hasLogoutIntentParam(searchParams);

  // Got unauthorized error while logging out. Logout occurred in a protected route.
  const isLoggingOutProtectedRoute = isUnauthorized && isLoggingOut;

  useEffect(() => {
    if (isLoggingOutProtectedRoute) {
      navigate(config.paths.fallback, {
        replace: true,
        preventScrollReset: true,
      });
    }
  }, [isLoggingOutProtectedRoute, navigate]);

  return isLoggingOutProtectedRoute;
}
