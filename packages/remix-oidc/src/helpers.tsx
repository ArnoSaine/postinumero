import type AccessTokenRepresentation from "@keycloak/keycloak-admin-client/lib/defs/accessTokenRepresentation.d.ts";
import { useSearchParams } from "@remix-run/react";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { userManager } from "./index.js";

export function RedirectURIInput() {
  const [searchParams] = useSearchParams();

  return (
    <input
      type="hidden"
      name="redirect_uri"
      value={searchParams.get("redirect_uri") ?? location.href}
    />
  );
}

export async function authenticated(
  access?: (token: AccessTokenRepresentation) => boolean
) {
  const user = await (await userManager)?.getUser();

  if (!user) {
    throw new Response(null, {
      status: 401,
    });
  }

  if (access) {
    if (!access(jwtDecode(user?.access_token))) {
      throw new Response(null, {
        status: 403,
      });
    }
  }
}

export const realmAccess =
  (role: string) => (token: AccessTokenRepresentation) =>
    token.realm_access?.roles?.includes(role) ?? false;
