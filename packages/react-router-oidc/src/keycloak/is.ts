import { createFromLoader, toBooleanValues } from "@arnosaine/is";
import options from "../options.js";
import { getKeycloakUser } from "./user.js";

export * from "../is.js";

export const hasRealmRoleConstructorDefaultArgs = [
  async () => toBooleanValues((await getKeycloakUser())?.realm_access.roles),
  undefined,
  { prop: options.isProps.hasRealmRole },
] as const;

export const hasResourceRoleConstructorDefaultArgs = [
  async () =>
    Object.fromEntries(
      Object.entries((await getKeycloakUser())?.resource_access ?? {}).map(
        ([clientId, { roles }]) => [clientId, roles],
      ),
    ),
  undefined,
  { method: "every", prop: options.isProps.hasResourceRole },
] as const;

export const hasRoleConstructorDefaultArgs = [
  async () => {
    const user = await getKeycloakUser();

    return toBooleanValues([
      ...(user?.realm_access.roles ?? []),
      ...Object.values(user?.resource_access ?? {}).flatMap(
        ({ roles }) => roles,
      ),
    ]) as {
      [x: string]: true;
    };
  },
  undefined,
  { prop: options.isProps.hasRole },
] as const;

const [HasRealmRole, useHasRealmRole, loadHasRealmRole] = createFromLoader(
  ...hasRealmRoleConstructorDefaultArgs,
);

const [HasResourceRole, useHasResourceRole, loadHasResourceRole] =
  createFromLoader(...hasResourceRoleConstructorDefaultArgs);

const [HasRole, useHasRole, loadHasRole] = createFromLoader(
  ...hasRoleConstructorDefaultArgs,
);

export {
  HasRealmRole,
  HasResourceRole,
  HasRole,
  loadHasRealmRole,
  loadHasResourceRole,
  loadHasRole,
  useHasRealmRole,
  useHasResourceRole,
  useHasRole,
};
