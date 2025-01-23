import {
  authenticated,
  realmAccess,
} from "@postinumero/remix-oidc/lib/helpers";
import { Link } from "@remix-run/react";

export const clientLoader = async () => {
  await authenticated(realmAccess("admin"));

  return null;
};

export default function Admin() {
  return (
    <>
      <h2>Restricted to realm admin users</h2>
      <Link to="/">Go to the main page</Link>
    </>
  );
}
