import {
  asyncJWKS,
  asyncUserManager,
} from "@postinumero/react-router-oidc-client";
import { createRemoteJWKSet } from "jose";
import {
  UserManager,
  type UserManagerSettings,
  WebStorageStateStore,
} from "oidc-client-ts";

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
