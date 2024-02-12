import { ClientActionFunctionArgs } from "@remix-run/react";
import { userManager } from "~/auth";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();

  if (formData.get("intent") === "sso") {
    userManager.signinRedirect({
      redirect_uri: location.href,
    });
  } else {
    await userManager.signinResourceOwnerCredentials({
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    });
  }

  return null;
};
