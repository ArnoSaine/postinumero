import type { IdTokenClaims, User } from "oidc-client-ts";
import loadUser from "../loaders/loadUser.ts";
import clientGetUser from "../user/getUser.ts";
import useUser from "../user/useUser.ts";
import type { DataFunctionArgs } from "../utils/react-router/DataFunctionArgs.ts";

export interface Roles {
  roles: string[];
}

export interface KeycloakUser extends IdTokenClaims {
  realm_access?: Roles;
  resource_access?: { [clientId: string]: Roles };
}

export const fromUser = (user: User | null | undefined) =>
  (user?.profile as KeycloakUser | undefined) ?? null;

export const useKeycloakUser = () => fromUser(useUser());

export const loadKeycloakUser = (args: DataFunctionArgs) =>
  fromUser(loadUser(args));

export const getKeycloakUser = async () => fromUser(await clientGetUser());
