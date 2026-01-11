import type { ClientLoaderFunction } from "react-router";
import { userManager } from "../user/manager.ts";

export const clientLoader: ClientLoaderFunction = async () => {
  await userManager.signinSilentCallback();

  return null;
};

export default function LoginCallback() {
  return null;
}
