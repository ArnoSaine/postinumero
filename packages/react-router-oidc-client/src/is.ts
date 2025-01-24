import { createFromLoader } from "@arnosaine/is";
import options from "./options.js";
import { getUser } from "./user.js";

export const isAuthenticatedConstructorDefaultArgs = [
  async () => ({ authenticated: Boolean(await getUser()) }),
  { authenticated: true },
  { prop: options.isProps.isAuthenticated },
] as const;

const [IsAuthenticated, useIsAuthenticated, loadIsAuthenticated] =
  createFromLoader(...isAuthenticatedConstructorDefaultArgs);

export { IsAuthenticated, loadIsAuthenticated, useIsAuthenticated };
