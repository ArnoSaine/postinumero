import { getUser, useUser } from "@postinumero/react-router-oidc-client";
import { jwtDecode } from "jwt-decode";
import { User } from "oidc-client-ts";

export interface Roles {
  roles: string[];
}

export type KeycloakUser = User["profile"] & {
  realm_access: Roles;
  resource_access: { [clientId: string]: Roles };
};

export const fromUser = (user: User | null | undefined) =>
  user?.access_token ? (jwtDecode(user?.access_token) as KeycloakUser) : null;

export const getKeycloakUser = async () => fromUser(await getUser());

export const useKeycloakUser = () => fromUser(useUser());
