import { asyncUserManager } from "@postinumero/react-router-oidc-client";
import {
  UserManager,
  UserManagerSettings,
  WebStorageStateStore,
} from "oidc-client-ts";

export default function initKeycloak(
  settings: {
    url: string;
    realm: string;
  } & Pick<UserManagerSettings, "client_id"> &
    Partial<UserManagerSettings>,
) {
  if (typeof localStorage !== "undefined") {
    asyncUserManager.resolve(
      new UserManager({
        authority: `${settings.url}/realms/${settings.realm}`,
        redirect_uri: "",
        userStore: new WebStorageStateStore({ store: localStorage }),
        ...settings,
      }),
    );
  }
}
