import options from "@postinumero/remix-react-intl/options";
import { FormProps, useFetcher } from "@remix-run/react";
import React from "react";

export default function LocaleForm(props: React.PropsWithChildren<FormProps>) {
  const { Form } = useFetcher();

  return (
    <Form action={options.routes.locale} method="POST" {...props}>
      {props.children}
    </Form>
  );
}
