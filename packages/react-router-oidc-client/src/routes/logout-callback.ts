import { ClientLoaderFunction } from "react-router";
import { asyncUserManager } from "../index.js";

export const clientLoader: ClientLoaderFunction = async () => {
  const userManager = await asyncUserManager.promise;
  await userManager.signoutSilentCallback();

  return null;
};

export default function LogoutCallback() {
  return null;
}
