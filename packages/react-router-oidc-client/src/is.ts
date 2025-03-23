import { createFromLoader } from "@arnosaine/is";
import { getUser } from "@postinumero/react-router-oidc-client";
import { options } from "@postinumero/react-router-oidc-client/options";

export const isAuthenticatedConstructorDefaultArgs = [
  async () => ({ authenticated: Boolean(await getUser()) }),
  { authenticated: true },
  { prop: options.isProps.isAuthenticated },
] as const;

const [IsAuthenticated, useIsAuthenticated, loadIsAuthenticated] =
  createFromLoader(...isAuthenticatedConstructorDefaultArgs);

export { IsAuthenticated, loadIsAuthenticated, useIsAuthenticated };
