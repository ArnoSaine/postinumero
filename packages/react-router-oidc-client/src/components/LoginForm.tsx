import { useLoginLocation } from "@postinumero/react-router-oidc-client";
import { ComponentType } from "react";
import { FormProps, Form as RouterForm } from "react-router";

export default function LoginForm({
  component: Form = RouterForm,
  ...props
}: FormProps & { component?: ComponentType<FormProps> }) {
  const loginLocation = useLoginLocation();

  return <Form method="POST" action={loginLocation} {...props} />;
}
