import { ClientLoaderFunctionArgs, redirect } from "@remix-run/react";
import { userManager } from "../../../index.js";

const paramNames = ["code", "error", "iss", "session_state", "state"];

export async function handleSigninCallback({
  request,
}: ClientLoaderFunctionArgs) {
  const url = new URL(request.url);

  if (hasAuthParams(url)) {
    try {
      await (await userManager)?.signinCallback();
    } catch {
      /* empty */
    }
    paramNames.forEach((name) => url.searchParams.delete(name));

    throw redirect(url.toString());
  }

  return null;
}

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
