import { FormProps, useFetcher } from "@remix-run/react";
import React from "react";
import options from "virtual:@postinumero/remix-react-intl/options";

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
