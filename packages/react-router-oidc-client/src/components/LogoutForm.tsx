import { ComponentType } from "react";
import { FormProps, Form as RouterForm } from "react-router";
import options from "../options.js";
import {
  redirectURISearchParams,
  setSearchParamLogoutIntent,
} from "../searchParams.js";

export default function LogoutForm({
  component: Form = RouterForm,
  redirect = true,
  ...props
}: FormProps & {
  component?: ComponentType<FormProps>;
  redirect?: boolean | null | string;
}) {
  if (typeof redirect === "boolean") {
    // Stay on current route

    const url = new URL(location.toString());

    if (redirect) {
      // In case of protected content, redirect to the fallback route.

      // We don't know if the current route is protected.
      // Add logout intent search param to use fallback in case of 401 after the
      // logout.
      setSearchParamLogoutIntent(url);
    }

    redirect = url.toString();
  }

  return (
    <Form
      action={`${options.routes.logout}${redirectURISearchParams(redirect)}`}
      method="POST"
      {...props}
    />
  );
}
