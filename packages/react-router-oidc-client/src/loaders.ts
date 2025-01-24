import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  replace,
} from "react-router";
import { loadIsAuthenticated } from "./is.js";
import options from "./options.js";
import { authorized } from "./response.js";
import { asyncUserManager, getUser } from "./user.js";
import { hasAuthParams } from "./utils.js";

export async function authenticated(
  args: ClientActionFunctionArgs | ClientLoaderFunctionArgs,
) {
  const user = await getUser();
  const isAuthenticated = await loadIsAuthenticated(args);

  authorized(isAuthenticated({ authenticated: true }));

  return user!;
}

export async function loadOIDCRoot(args: ClientLoaderFunctionArgs) {
  await removeAuthParamsReplace(args);

  return loadOIDCRootValues(args);
}

export async function loadOIDCRootValues(args: ClientLoaderFunctionArgs) {
  const isAuthenticated = await loadIsAuthenticated(args);

  return {
    [options.isProps.isAuthenticated]: isAuthenticated.__values,
  };
}

export async function removeAuthParamsReplace({
  request,
}: ClientLoaderFunctionArgs) {
  const url = new URL(request.url);

  if (hasAuthParams(url)) {
    try {
      const userManager = await asyncUserManager.promise;
      await userManager.signinCallback();
    } catch {
      /* empty */
    }
    options.removeAuthParams.forEach((name) => url.searchParams.delete(name));

    throw replace(url.toString());
  }
}
