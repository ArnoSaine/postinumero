import type { ClientLoaderFunction } from "react-router";
import { userManager } from "../user/manager.ts";

export const clientLoader: ClientLoaderFunction = async () => { 
  await userManager.signoutSilentCallback();

  return null;
};

export default function LogoutCallback() {
  return null;
}
