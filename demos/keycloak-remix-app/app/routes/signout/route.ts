import { ClientActionFunctionArgs, redirect } from "@remix-run/react";
import { userManager } from "~/auth";
import { signoutRedirect } from "~/auth/signout/utils";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  await userManager.revokeTokens();
  await userManager.removeUser();

  throw signoutRedirect(formData.get("redirect_uri") as string);
};

export const clientLoader = async () => {
  return redirect("/");
};

export default function Signout() {
  return null;
}
