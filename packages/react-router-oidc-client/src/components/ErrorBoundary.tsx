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

export const withAuthErrorBoundary = (
  UnauthorizedErrorBoundary: React.ComponentType<any>,
  ErrorBoundary: React.ComponentType<any>,
) =>
  function WithAuthErrorBoundary(props: any) {
    const isLoggingOutProtectedRoute = useHandleLogoutProtectedRoute();
    const isUnauthorizedRouteError = useIsUnauthorizedRouteError();
    useUserMonitor();

    if (isLoggingOutProtectedRoute) {
      return null;
    }

    if (isUnauthorizedRouteError) {
      return <UnauthorizedErrorBoundary {...props} />;
    }

    return <ErrorBoundary {...props} />;
  };

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
