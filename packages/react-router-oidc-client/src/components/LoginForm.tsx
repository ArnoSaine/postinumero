import { ComponentType } from "react";
import { FormProps, Form as RouterForm } from "react-router";
import options from "../options.js";
import RedirectURIInput from "./RedirectURIInput.js";

export default function LoginForm({
  children,
  component: Form = RouterForm,
  ...props
}: FormProps & { component?: ComponentType<FormProps> }) {
  return (
    <Form method="POST" action={options.routes.login} {...props}>
      <RedirectURIInput />
      {children}
    </Form>
  );
}
