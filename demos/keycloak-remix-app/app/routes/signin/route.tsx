import { ClientActionFunctionArgs, redirect } from "@remix-run/react";
import { userManager } from "~/auth";
import { authenticated } from "~/auth/helpers";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();

  if (formData.get("intent") === "sso") {
    userManager.signinRedirect({
      redirect_uri: (formData.get("redirect_uri") as string) ?? location.href,
    });
  } else {
    await userManager.signinResourceOwnerCredentials({
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    });
    throw redirect(formData.get("redirect_uri") as string);
  }

  return null;
};

export const clientLoader = async () => {
  await authenticated();

  throw redirect("/");
};

export default function Signin() {
  return null;
}
