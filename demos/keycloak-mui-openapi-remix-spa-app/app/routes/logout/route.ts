import { ClientActionFunctionArgs, redirect } from "@remix-run/react";
import { userManager } from "~/auth";
import { logoutRedirect } from "~/auth/helpers";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  await userManager.revokeTokens();
  await userManager.removeUser();

  throw logoutRedirect(formData.get("redirect_uri") as string);
};

export const clientLoader = async () => {
  throw redirect("/");
};

export default function Logout() {
  return null;
}
