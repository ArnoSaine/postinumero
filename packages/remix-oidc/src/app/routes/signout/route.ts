import { ClientActionFunctionArgs, redirect } from "@remix-run/react";
import userConfig from "../../../config.js";
import { userManager } from "../../../index.js";
import { signoutRedirect } from "./utils.js";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  await (await userManager)?.revokeTokens();
  await (await userManager)?.removeUser();

  throw signoutRedirect(formData.get("redirect_uri") as string);
};

export const clientLoader = async () => {
  return redirect(userConfig.routes.home);
};

export default function Signout() {
  return null;
}
