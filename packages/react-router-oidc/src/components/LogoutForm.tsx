import { ComponentType } from "react";
import { FormProps, Form as RouterForm } from "react-router";
import options from "../options.js";
import RedirectURIInput from "./RedirectURIInput.js";

export default function LogoutForm({
  children,
  component: Form = RouterForm,
  ...props
}: FormProps & { component?: ComponentType<FormProps> }) {
  return (
    <Form action={options.routes.logout} method="POST" {...props}>
      <RedirectURIInput internal />
      {children}
    </Form>
  );
}
