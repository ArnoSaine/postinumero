import { useRouteLoaderData } from "@remix-run/react";
import { UserManager } from "oidc-client-ts";
import { withLoader } from "./app/root.js";
import configRuntime from "./config.js";

export let userManager = Promise.resolve(
  (async () => {
    if (typeof document !== "undefined") {
      const userManager = new UserManager(
        configRuntime.getUserManagerSettings()
      );

      if (await userManager.getUser()) {
        try {
          await userManager.signinSilent();
        } catch {
          await userManager.revokeTokens();
          await userManager.removeUser();
        }
      }

      return userManager;
    }
  })()
);

export function useUser() {
  const { user } =
    useRouteLoaderData<ReturnType<typeof withLoader>>("root") ?? {};

  return user;
}
