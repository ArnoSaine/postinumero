import { authenticated } from "@postinumero/react-router-oidc-client/keycloak";
import type { ClientLoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/admin";

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
  await authenticated(args as ClientLoaderFunctionArgs, {
    realmRoles: ["viewer"],
  });

  return null;
};

export default function Admin() {
  return <div className="pt-16 pb-4">[Protected admin route]</div>;
}
