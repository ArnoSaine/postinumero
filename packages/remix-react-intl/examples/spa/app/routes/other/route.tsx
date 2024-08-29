import { loadIntl } from "@postinumero/remix-react-intl/intl";

import { ClientLoaderFunctionArgs, Outlet } from "@remix-run/react";
import { FormattedMessage } from "react-intl";

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  const intl = await loadIntl(args);

  const message = intl.formatMessage({
    defaultMessage: "Loader message",
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
