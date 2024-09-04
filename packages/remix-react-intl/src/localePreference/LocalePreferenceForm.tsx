import { ActionFunctionArgs } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  FormProps,
  useFetcher,
} from "@remix-run/react";
import { useIntlMatch } from "../hooks.js";

const searchParams = new URLSearchParams({
  "__remix-react-intl": "locale-preference",
});

export const isLocalePreferenceFormAction = (
  args: ActionFunctionArgs | ClientActionFunctionArgs,
) => {
  const url = new URL(args.request.url);
  return [...searchParams].every(
    ([name, value]) => url.searchParams.get(name) === value,
  );
};

export default function LocalePreferenceForm(
  props: React.PropsWithChildren<FormProps>,
) {
  const { Form, submit } = useFetcher();
  const { pathname } = useIntlMatch();

  return (
    <Form
      action={`${pathname}?${searchParams}`}
      method="POST"
      {...props}
      onChange={(event) => {
        props.onChange?.(event);
        submit(event.currentTarget);
      }}
    />
  );
}
