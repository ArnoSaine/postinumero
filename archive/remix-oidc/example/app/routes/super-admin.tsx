import {
  authenticated,
  realmAccess,
} from "@postinumero/remix-oidc/lib/helpers";
import { Link } from "@remix-run/react";

export const clientLoader = async () => {
  await authenticated(realmAccess("super-admin"));

  return null;
};

export default function SuperAdmin() {
  return (
    <>
      <h2>Restricted to realm super-admin users</h2>
      <Link to="/">Go to the main page</Link>
    </>
  );
}
