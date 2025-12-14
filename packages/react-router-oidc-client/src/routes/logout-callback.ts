import type { ClientLoaderFunction } from "react-router";
import { asyncUserManager } from "../user/manager.ts";

export const clientLoader: ClientLoaderFunction = async () => {
  const userManager = await asyncUserManager.promise;
  await userManager.signoutSilentCallback();

  return null;
};

export default function LogoutCallback() {
  return null;
}
