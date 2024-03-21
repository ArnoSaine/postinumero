import { Outlet } from "@remix-run/react";
import { FormattedMessage } from "react-intl";

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
