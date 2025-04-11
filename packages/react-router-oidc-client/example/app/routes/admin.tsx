import { authenticated } from "@postinumero/react-router-oidc-client/keycloak";
import type { Route } from "./+types/admin";
import { Form } from "react-router";
import { loadUser } from "@postinumero/react-router-oidc-client";

export const action = async (args: Route.ActionArgs) => {
  await authenticated(args, {
    realmRoles: ["viewer"],
  });

  console.log("action");

  return null;
};

export const loader = async (args: Route.LoaderArgs) => {
  await authenticated(args, {
    realmRoles: ["viewer"],
  });

  return null;
};

export default function Admin() {
  return (
    <>
      <div className="pt-16 pb-4">[Protected admin route]</div>
      <Form method="POST">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Test action
        </button>
      </Form>
    </>
  );
}
