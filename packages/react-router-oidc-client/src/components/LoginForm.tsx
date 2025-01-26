import { ComponentType } from "react";
import { FormProps, Form as RouterForm } from "react-router";
import { useLoginLocation } from "../hooks.js";

export default function LoginForm({
  component: Form = RouterForm,
  ...props
}: FormProps & { component?: ComponentType<FormProps> }) {
  const loginLocation = useLoginLocation();

  return <Form method="POST" action={loginLocation} {...props} />;
}
