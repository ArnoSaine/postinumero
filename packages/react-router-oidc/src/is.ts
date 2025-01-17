import { createFromLoader, toBooleanValues } from "@arnosaine/is";
import { getKeycloakUser } from "./keycloak.js";
import { getUser } from "./user.js";

export const isAuthenticatedConstructorDefaultArgs = [
  async () => ({ authenticated: Boolean(await getUser()) }),
  { authenticated: true },
  { prop: "__isAuthenticated" },
] as const;

export const hasRealmRoleConstructorDefaultArgs = [
  async () => toBooleanValues((await getKeycloakUser())?.realm_access.roles),
  {},
  { prop: "__hasRealmRole" },
] as const;

export const hasResourceRoleConstructorDefaultArgs = [
  async () =>
    Object.fromEntries(
      Object.entries((await getKeycloakUser())?.resource_access as any).map(
        ([clientId, { roles }]: any) => [clientId, roles],
      ),
    ),
  {},
  { prop: "__hasResourceRole" },
] as const;

const [IsAuthenticated, useIsAuthenticated, loadIsAuthenticated] =
  createFromLoader(...isAuthenticatedConstructorDefaultArgs);

const [HasRealmRole, useHasRealmRole, loadHasRealmRole] = createFromLoader(
  ...hasRealmRoleConstructorDefaultArgs,
);

const [HasResourceRole, useHasResourceRole, loadHasResourceRole] =
  createFromLoader(...hasResourceRoleConstructorDefaultArgs);

export {
  HasRealmRole,
  HasResourceRole,
  IsAuthenticated,
  loadHasRealmRole,
  loadHasResourceRole,
  loadIsAuthenticated,
  useHasRealmRole,
  useHasResourceRole,
  useIsAuthenticated,
};
