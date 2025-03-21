import { allowed } from "assert-response";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
} from "react-router";
import * as base from "../loaders.js";
import { loadHasRealmRole, loadHasResourceRole, loadHasRole } from "./is.js";
import { getKeycloakUser } from "./user.js";

export async function authenticated(
  args: ClientActionFunctionArgs | ClientLoaderFunctionArgs,
  roles?: {
    realmRoles?: string[];
    resourceRoles?: { [clientId: string]: string[] };
  },
) {
  await base.authenticated(args);

  const user = await getKeycloakUser();
  const hasRealmRole = await loadHasRealmRole(args);
  const hasResourceRole = await loadHasResourceRole(args);

  const { realmRoles = [], resourceRoles = {} } = roles ?? {};

  allowed(
    hasRealmRole(Object.fromEntries(realmRoles.map((role) => [role, true]))),
  );

  allowed(hasResourceRole(resourceRoles));

  return user;
}

export async function loadOIDCRoot(args: ClientLoaderFunctionArgs) {
  await base.loadOIDCRoot(args);

  return loadOIDCRootValues(args);
}

export async function loadOIDCRootValues(args: ClientLoaderFunctionArgs) {
  const hasRealmRole = await loadHasRealmRole(args);
  const hasResourceRole = await loadHasResourceRole(args);
  const hasRole = await loadHasRole(args);

  return {
    ...(await base.loadOIDCRootValues(args)),
    ...hasRealmRole,
    ...hasResourceRole,
    ...hasRole,
  };
}
