import { createFromLoader, toBooleanValues } from "@arnosaine/is";
import config from "../config.ts";
import type { DataFunctionArgs } from "../utils/react-router/DataFunctionArgs.ts";
import { loadKeycloakUser } from "./user.ts";

export * from "../is.js";

const [HasRealmRole, useHasRealmRole, loadHasRealmRole] = createFromLoader(
  (args: DataFunctionArgs) =>
    toBooleanValues(loadKeycloakUser(args)?.realm_access?.roles),
  undefined,
  { prop: "__hasRealmRole", routeId: config.route.id },
);

const [HasResourceRole, useHasResourceRole, loadHasResourceRole] =
  createFromLoader(
    (args: DataFunctionArgs) =>
      Object.fromEntries(
        Object.entries(loadKeycloakUser(args)?.resource_access ?? {}).map(
          ([clientId, { roles }]) => [clientId, roles],
        ),
      ),
    undefined,
    {
      method: "every",
      prop: "__hasResourceRole",
      routeId: config.route.id,
    },
  );

const [HasRole, useHasRole, loadHasRole] = createFromLoader(
  (args: DataFunctionArgs) => {
    const user = loadKeycloakUser(args);

    return toBooleanValues([
      ...(user?.realm_access?.roles ?? []),
      ...Object.values(user?.resource_access ?? {}).flatMap(
        ({ roles }) => roles,
      ),
    ]) as {
      [x: string]: true;
    };
  },
  undefined,
  { prop: "__hasRole", routeId: config.route.id },
);

const [Has, useHas, loadHas] = createFromLoader(
  (args: DataFunctionArgs) => {
    const user = loadKeycloakUser(args);

    const realmRoles = user?.realm_access?.roles ?? [];
    const resourceRoles = Object.values(user?.resource_access ?? {}).flatMap(
      ({ roles }) => roles,
    );

    return {
      role: [...realmRoles, ...resourceRoles],
      "realm-role": realmRoles,
      ...Object.fromEntries(
        Object.entries(user?.resource_access ?? {}).map(
          ([clientId, { roles }]) => [`${clientId}-role`, roles],
        ),
      ),
    };
  },
  undefined,
  { prop: "__has", routeId: config.route.id },
);

export {
  Has,
  HasRealmRole,
  HasResourceRole,
  HasRole,
  loadHas,
  loadHasRealmRole,
  loadHasResourceRole,
  loadHasRole,
  useHas,
  useHasRealmRole,
  useHasResourceRole,
  useHasRole,
};
