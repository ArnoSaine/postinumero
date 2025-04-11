import { DataFunctionArgs } from "@arnosaine/is";
import {
  asyncUserManager,
  getUser,
  hasAuthParams,
  loadIsAuthenticated,
  options,
} from "@postinumero/react-router-oidc-client";
import { authorized } from "assert-response";
import { replace } from "react-router";

export async function authenticated(args: DataFunctionArgs) {
  const user = await getUser();
  const isAuthenticated = await loadIsAuthenticated(args);

  authorized(isAuthenticated({ authenticated: true }), "");

  return user!;
}

export async function loadOIDCRoot(args: DataFunctionArgs) {
  await removeAuthParamsReplace(args);

  return loadOIDCRootValues(args);
}

export async function loadOIDCRootValues(args: DataFunctionArgs) {
  const isAuthenticated = await loadIsAuthenticated(args);

  return {
    [options.isProps.isAuthenticated]: isAuthenticated.__values,
  };
}

export async function removeAuthParamsReplace({ request }: DataFunctionArgs) {
  const url = new URL(request.url);

  if (typeof document !== "undefined" && hasAuthParams(url)) {
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
