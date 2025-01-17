import { jwtDecode } from "jwt-decode";
import {
  User,
  UserManager,
  UserManagerSettings,
  WebStorageStateStore,
} from "oidc-client-ts";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
} from "react-router";
import {
  allowed,
  asyncUserManager,
  authorized,
  getUser,
  loadHasRealmRole,
  loadHasResourceRole,
  loadIsAuthenticated,
  useUser,
} from "./index.js";

export function initKeycloak(
  config: {
    url: string;
    realm: string;
    clientId: string;
  } & Partial<UserManagerSettings>,
) {
  if (typeof localStorage !== "undefined") {
    asyncUserManager.resolve(
      new UserManager({
        authority: `${config.url}/realms/${config.realm}`,
        client_id: config.clientId,
        redirect_uri: "",
        userStore: new WebStorageStateStore({ store: localStorage }),
        ...config,
      }),
    );
  }
}

interface Roles {
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

export async function authenticated(
  args: ClientLoaderFunctionArgs | ClientActionFunctionArgs,
  roles?: {
    realmRoles?: string[];
    resourceRoles?: { [clientId: string]: string[] };
  },
) {
  const user = await getKeycloakUser();
  const isAuthenticated = await loadIsAuthenticated(args);
  const hasRealmRole = await loadHasRealmRole(args);
  const hasResourceRole = await loadHasResourceRole(args);

  const { realmRoles = [], resourceRoles = {} } = roles ?? {};

  authorized(isAuthenticated({ authenticated: true }));

  allowed(
    hasRealmRole(Object.fromEntries(realmRoles.map((role) => [role, true]))),
  );

  allowed(hasResourceRole(resourceRoles));

  return user;
}
