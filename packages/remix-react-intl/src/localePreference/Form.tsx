import options from "@postinumero/remix-react-intl/options";
import { FormProps, useFetcher } from "@remix-run/react";
import React from "react";

export default function LocalePreferenceForm(
  props: React.PropsWithChildren<FormProps>,
) {
  const { Form, submit } = useFetcher();

  return (
    <Form
      action={options.routes.locale}
      method="POST"
      {...props}
      onChange={(event) => {
        props.onChange?.(event);
        submit(event.currentTarget);
      }}
    />
  );
}
