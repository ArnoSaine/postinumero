import type { ElementType } from "react";
import { Form as ReactRouterForm } from "react-router";
import config from "../config.ts";
import { setSearchParamLogoutIntent } from "../logoutIntent.ts";
import { redirectURISearchParams } from "../searchParams.ts";
import type { PolymorphicProps } from "../utils/PolymorphicProps.ts";
import { request } from "../utils/react-router/requestMiddleware.ts";

export default function LogoutForm<
  C extends ElementType = typeof ReactRouterForm,
>({
  component: Form = ReactRouterForm,
  redirect = true,
  ...props
}: PolymorphicProps<C> & {
  redirect?: boolean | null | string;
}) {
  if (typeof redirect === "boolean") {
    // Stay on current route

    const url = new URL(request?.url ?? location.toString());

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
      action={`${config.paths.logout}${redirectURISearchParams(redirect)}`}
      method="POST"
      {...props}
    />
  );
}
