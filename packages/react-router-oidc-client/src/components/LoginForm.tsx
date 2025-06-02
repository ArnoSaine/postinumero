import {
  type PolymorphicProps,
  useLoginLocation,
} from "@postinumero/react-router-oidc-client";
import type { ElementType } from "react";
import { Form as ReactRouterForm } from "react-router";

export default function LoginForm<
  C extends ElementType = typeof ReactRouterForm,
>({ component: Form = ReactRouterForm, ...props }: PolymorphicProps<C>) {
  const loginLocation = useLoginLocation();

  return <Form method="POST" action={loginLocation} {...props} />;
}
