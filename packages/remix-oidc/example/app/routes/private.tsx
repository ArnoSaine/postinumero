import { authenticated } from "@postinumero/remix-oidc/lib/helpers";
import { Link } from "@remix-run/react";

export const clientLoader = async () => {
  await authenticated();

  return null;
};

export default function Private() {
  return (
    <>
      <h2>Restricted to authenticated users</h2>
      <Link to="/">Go to the main page</Link>
    </>
  );
}
