import type { UserManager } from "oidc-client-ts";
import {
  ClientActionFunction,
  ClientLoaderFunction,
  //data,
  replace,
} from "react-router";
import invariant from "tiny-invariant";
import { asyncUserManager, authenticated } from "../index.js";
import options from "../options.js";

export const clientAction: ClientActionFunction = async (args) => {
  const userManager: UserManager = await asyncUserManager.promise;

  const {
    intent,
    [options.redirectURIOptionName as "redirect_uri"]: redirect_uri,
    ...credentials
  } = Object.fromEntries(await args.request.formData()) as {
    intent?: "sso";
    redirect_uri: string;
    username: string;
    password: string;
  };

  if (intent === "sso") {
    invariant(
      !redirect_uri.startsWith("/"),
      `'redirect_uri' must be full URL for signinRedirect. Got: ${redirect_uri}`,
    );

    userManager.signinRedirect({
      redirect_uri,
    });
    return null;
  }

  try {
    await userManager.signinResourceOwnerCredentials(credentials);
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, {
        status: 401,
      });
    }
  }

  return replace(redirect_uri);
};

export const clientLoader: ClientLoaderFunction = async () => {
  await authenticated();

  return replace(options.fallbackRoute);
};

export default function Login() {
  return null;
}
