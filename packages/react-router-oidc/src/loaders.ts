import { ClientLoaderFunctionArgs, replace } from "react-router";
import {
  loadHasRealmRole,
  loadHasResourceRole,
  loadIsAuthenticated,
} from "./is.js";
import { authorized } from "./response.js";
import { asyncUserManager, getUser } from "./user.js";
import { hasAuthParams } from "./utils.js";

export async function authenticated() {
  const user = await getUser();

  authorized(user);

  return user;
}

export async function loadOIDCRoot(args: ClientLoaderFunctionArgs) {
  await removeAuthParamsReplace(args);

  return loadOIDCRootValues(args);
}

export async function loadOIDCRootValues(args: ClientLoaderFunctionArgs) {
  const isAuthenticated = await loadIsAuthenticated(args);
  const hasRealmRole = await loadHasRealmRole(args);
  const hasResourceRole = await loadHasResourceRole(args);

  return {
    __isAuthenticated: isAuthenticated.__values,
    __hasRealmRole: hasRealmRole.__values,
    __hasResourceRole: hasResourceRole.__values,
  };
}

export async function removeAuthParamsReplace({
  request,
}: ClientLoaderFunctionArgs) {
  const paramNames = ["code", "error", "iss", "session_state", "state"];
  const url = new URL(request.url);

  if (hasAuthParams(url)) {
    try {
      const userManager = await asyncUserManager.promise;
      await userManager.signinCallback();
    } catch {
      /* empty */
    }
    paramNames.forEach((name) => url.searchParams.delete(name));

    throw replace(url.toString());
  }
}
