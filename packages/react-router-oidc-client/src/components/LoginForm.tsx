import { ComponentType } from "react";
import { FormProps, Form as RouterForm, useSearchParams } from "react-router";
import { useIsLoginRoute } from "../hooks.js";
import options from "../options.js";
import { getRedirectURI, redirectURISearchParams } from "../searchParams.js";
import { useLocationString } from "../utils.js";

export default function LoginForm({
  component: Form = RouterForm,
  ...props
}: FormProps & { component?: ComponentType<FormProps> }) {
  const [searchParams] = useSearchParams();
  const locationString = useLocationString();
  const isLoginRoute = useIsLoginRoute();

  return (
    <Form
      method="POST"
      action={`${options.routes.login}${
        // Redirect after successful login
        redirectURISearchParams(
          // Redirect to URI from search params
          getRedirectURI(searchParams) ??
            // If not available, use fallback
            (isLoginRoute
              ? // On login route, use fallback route option
                options.fallbackRoute
              : // Otherwise, use current route
                locationString),
        )
      }`}
      {...props}
    />
  );
}
