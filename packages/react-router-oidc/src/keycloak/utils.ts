import { jwtDecode } from "jwt-decode";
import { User } from "oidc-client-ts";
import { KeycloakUser } from "./user.js";

export const fromUser = (user: User | null | undefined) =>
  user?.access_token ? (jwtDecode(user?.access_token) as KeycloakUser) : null;
