import type { UserManager } from "oidc-client-ts";
import { ClientActionFunction, replace } from "react-router";
import { asyncUserManager } from "../index.js";
import options from "../options.js";

export const clientAction: ClientActionFunction = async (args) => {
  const userManager: UserManager = await asyncUserManager.promise;
  await userManager.revokeTokens();
  await userManager.removeUser();
  const formData = await args.request.formData();
  let redirectURI = formData.get(options.redirectURIOptionName) as string;

  if (redirectURI.startsWith("/")) {
    // We don't know if the current route is protected
    // If redirectURI is internal, add logout intent search param

    const url = new URL(location.href);

    url.searchParams.set(
      options.logoutIntentSearchParam.name,
      options.logoutIntentSearchParam.value,
    );

    redirectURI = url.toString();
  }

  return replace(redirectURI);
};
