import type { ErrorResponse } from "oidc-client-ts";
import { isRouteErrorResponse, useRouteError } from "react-router";

export default function useLoginError() {
  const error = useRouteError();

  if (
    isRouteErrorResponse(error) &&
    ["invalid_grant", "unauthorized_client"].includes(error.data?.error)
  ) {
    return error.data as ErrorResponse;
  }
}
