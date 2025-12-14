import { toBooleanValues } from "@arnosaine/is";
import { allowed } from "assert-response";
import base_authenticated from "../../loaders/authenticated.ts";
import type { DataFunctionArgs } from "../../utils/react-router/DataFunctionArgs.ts";
import { loadHasRealmRole, loadHasResourceRole } from "../is.ts";
import { loadKeycloakUser } from "../user.ts";

export default async function authenticated(
  args: DataFunctionArgs,
  roles?: {
    realmRoles?: string[];
    resourceRoles?: { [clientId: string]: string[] };
  },
) {
  await base_authenticated(args);

  const user = loadKeycloakUser(args);
  const hasRealmRole = await loadHasRealmRole(args);
  const hasResourceRole = await loadHasResourceRole(args);

  const { realmRoles = [], resourceRoles = {} } = roles ?? {};

  allowed(hasRealmRole(toBooleanValues(realmRoles)));

  allowed(hasResourceRole(resourceRoles));

  return user;
}
