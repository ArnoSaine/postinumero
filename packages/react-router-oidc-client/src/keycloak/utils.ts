import { KeycloakUser } from "@postinumero/react-router-oidc-client/keycloak";
import { jwtDecode } from "jwt-decode";
import { User } from "oidc-client-ts";

export const fromUser = (user: User | null | undefined) =>
  user?.access_token ? (jwtDecode(user?.access_token) as KeycloakUser) : null;
