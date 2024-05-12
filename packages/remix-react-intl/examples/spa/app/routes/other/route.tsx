import { Outlet } from "@remix-run/react";
import { FormattedMessage } from "react-intl";

export const clientLoader = () => null;

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
