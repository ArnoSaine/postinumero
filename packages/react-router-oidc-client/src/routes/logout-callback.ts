import { asyncUserManager } from "@postinumero/react-router-oidc-client";
import { ClientLoaderFunction } from "react-router";

export const clientLoader: ClientLoaderFunction = async () => {
  const userManager = await asyncUserManager.promise;
  await userManager.signoutSilentCallback();

  return null;
};

export default function LogoutCallback() {
  return null;
}
