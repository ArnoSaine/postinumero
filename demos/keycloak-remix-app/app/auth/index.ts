import { useRouteLoaderData } from "@remix-run/react";
import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { loader } from "./root";

const isClient = typeof document !== "undefined";

export const userManager = new UserManager({
  authority: "http://localhost:8080/realms/demo",
  client_id: "demo",
  userStore: isClient
    ? new WebStorageStateStore({ store: localStorage })
    : undefined,
  redirect_uri: isClient ? location.href : "",
});

if (await userManager.getUser()) {
  try {
    await userManager.signinSilent();
  } catch {
    await userManager.revokeTokens();
    await userManager.removeUser();
  }
}

export const loadUser = () => {
  return userManager.getUser();
};

export function useUser() {
  const { user } = useRouteLoaderData<typeof loader>("root") ?? {};

  return user;
}
