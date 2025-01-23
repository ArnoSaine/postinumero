import { Form, FormProps } from "@remix-run/react";
import React from "../../../../$node_modules/@types/react/index.js";
import userConfig from "../../../config.js";
import { RedirectURIInput } from "../../../helpers.js";

export default function SigninForm(props: React.PropsWithChildren<FormProps>) {
  return (
    <Form replace action={userConfig.routes.signin} method="POST" {...props}>
      <RedirectURIInput />
      {props.children}
    </Form>
  );
}
