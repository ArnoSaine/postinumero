import { useLoaderData } from "@remix-run/react";
import { IntlProvider } from "react-intl";
import loadMessages from "./loadMessages";

export default function withIntlProvider(Component) {
  return (props) => {
    const { messages } = useLoaderData<typeof loadMessages>();

    return (
      <IntlProvider locale="fi" messages={messages}>
        <Component {...props} />
      </IntlProvider>
    );
  };
}
