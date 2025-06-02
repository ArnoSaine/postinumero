import {
  hasLogoutIntentParam,
  options,
} from "@postinumero/react-router-oidc-client";
import { useEffect } from "react";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
  useSearchParams,
} from "react-router";
import type { CreateErrorBoundaryProps } from "react-router/route-module";

export const withHandleAuthErrorBoundary = (
  UnauthorizedErrorBoundary: React.ComponentType<CreateErrorBoundaryProps<any>>,
  ErrorBoundary: React.ComponentType<CreateErrorBoundaryProps<any>>,
) =>
  function WithHandleAuthErrorBoundary(props: CreateErrorBoundaryProps<any>) {
    const isLoggingOutProtectedRoute = useHandleLogoutProtectedRoute();
    const isUnauthorizedRouteError = useIsUnauthorizedRouteError();

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
      navigate(options.fallbackRoute, {
        replace: true,
        preventScrollReset: true,
      });
    }
  });

  return isLoggingOutProtectedRoute;
}
