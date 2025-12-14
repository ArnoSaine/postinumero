import type { ElementType } from "react";
import { Form as ReactRouterForm } from "react-router";
import useLoginLocation from "../hooks/useLoginLocation.ts";
import type { PolymorphicProps } from "../utils/PolymorphicProps.ts";

export default function LoginForm<
  C extends ElementType = typeof ReactRouterForm,
>({ component: Form = ReactRouterForm, ...props }: PolymorphicProps<C>) {
  const loginLocation = useLoginLocation();

  return <Form method="POST" action={loginLocation} {...props} />;
}
