import { jwtVerify } from "jose";
import type { UserManagerSettingsStore } from "oidc-client-ts";
import { asyncUserManager } from "../user/manager.ts";
import { asyncJWKS } from "./jwks.ts";

export const options = {
  jwtVerifyOptions: (settings: UserManagerSettingsStore) => ({
    issuer: settings.authority,
    // audience: settings.client_id,
  }),
};

export default async function verifyToken(token: string) {
  const userManager = await asyncUserManager.promise;

  const { payload } = await jwtVerify(
    token,
    await asyncJWKS.promise,
    options.jwtVerifyOptions(userManager.settings),
  );

  return payload;
}
