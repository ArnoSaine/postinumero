import { loadIntl } from "@postinumero/remix-react-intl";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { FormattedMessage } from "react-intl";

export const loader = async (args: LoaderFunctionArgs) => {
  const intl = await loadIntl(args);

  const message = intl.formatMessage({
    defaultMessage: "Hello from loader!",
  });

  console.log(message);

  return null;
};

export default function Other() {
  return (
    <>
      <h2>
        <FormattedMessage defaultMessage="Other page" />
      </h2>
      <Outlet />
    </>
  );
}
