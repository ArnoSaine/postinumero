import {
  ClientLoaderFunctionArgs,
  json,
  redirect,
  useRouteLoaderData,
  ShouldRevalidateFunction,
} from "@remix-run/react";
import { UserManager } from "oidc-client-ts";
// import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const paramNames = ["code", "error", "iss", "session_state", "state"];

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

export const removeAuthParamsRedirect = async ({
  request,
}: ClientLoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (hasAuthParams(url)) {
    await userManager.signinCallback();
    paramNames.forEach((name) => url.searchParams.delete(name));

    throw redirect(url.toString());
  }

  return null;
};

export const loadUser = async (args: ClientLoaderFunctionArgs) => {
  await removeAuthParamsRedirect(args);

  return json({
    user: await userManager.getUser(),
  });
};

export const shouldRevalidateUser: ShouldRevalidateFunction = (args) => {
  return args.formAction
    ? ["/login", "/logout"].includes(args.formAction)
    : false;
};

// https://github.com/authts/react-oidc-context/blob/7a542d3e2710be1d350d66f0940f3b8ea717a388/src/utils.ts#L4
function hasAuthParams(location: URL) {
  let searchParams = location.searchParams;
  if (
    (searchParams.get("code") || searchParams.get("error")) &&
    searchParams.get("state")
  ) {
    return true;
  }
  searchParams = new URLSearchParams(location.hash.replace("#", "?"));
  if (
    (searchParams.get("code") || searchParams.get("error")) &&
    searchParams.get("state")
  ) {
    return true;
  }
  return false;
}
