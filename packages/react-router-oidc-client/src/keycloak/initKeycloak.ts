import { createRemoteJWKSet } from "jose";
import {
  UserManager,
  type UserManagerSettings,
  WebStorageStateStore,
} from "oidc-client-ts";
import { asyncJWKS } from "../token/jwks.ts";
import { asyncUserManager } from "../user/manager.ts";
import isServer from "../utils/isServer.ts";

export default function initKeycloak({
  url,
  realm,
  ...otherSettings
}: {
  url: string;
  realm: string;
} & Pick<UserManagerSettings, "client_id"> &
  Partial<UserManagerSettings>) {
  const userManager = new UserManager({
    authority: `${url}/realms/${realm}`,
    redirect_uri: "",
    silent_redirect_uri: isServer
      ? undefined
      : new URL(
          `${import.meta.env.BASE_URL}login-callback`,
          location.href,
        ).toString(),
    userStore:
      typeof localStorage === "undefined"
        ? undefined
        : new WebStorageStateStore({ store: localStorage }),
    ...otherSettings,
  });

  const JWKS = createRemoteJWKSet(
    new URL(`${userManager.settings.authority}/protocol/openid-connect/certs`),
  );

  asyncUserManager.resolve(userManager);
  asyncJWKS.resolve(JWKS);
}
