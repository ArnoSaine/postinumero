import {
  ClientLoaderFunctionArgs,
  json,
  useRouteLoaderData,
} from "@remix-run/react";
import { UserManager } from "oidc-client-ts";
import { removeAuthParamsRedirect } from "./utils";
// import { UserManager, WebStorageStateStore } from "oidc-client-ts";

export function useUser() {
  const { user } = useRouteLoaderData<typeof loadUser>("root")!;

  return user;
}

export const userManager = new UserManager({
  authority: "http://localhost:8080/realms/demo",
  client_id: "demo",
  //userStore: new WebStorageStateStore({ store: localStorage }),
  redirect_uri: "",
});

export const loadUser = async (args: ClientLoaderFunctionArgs) => {
  await removeAuthParamsRedirect(args);

  return json({
    user: await userManager.getUser(),
  });
};
