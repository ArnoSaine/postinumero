import { ClientActionFunctionArgs, redirect } from "@remix-run/react";
import userConfig from "../../../config.js";
import { authenticated } from "../../../helpers.js";
import { userManager } from "../../../index.js";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();

  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    data[key] = value as string;
  });

  data.redirect_uri = new URL(data.redirect_uri!, location.href).toString();

  const { method, ...args } = data;

  await (await userManager)?.[method as "signinRedirect"](args);

  throw redirect(args.redirect_uri!);
};

export const clientLoader = async () => {
  await authenticated();

  throw redirect(userConfig.routes.home);
};

export default function Signin() {
  return null;
}
