import { replace } from "react-router";
import { asyncUserManager } from "../../user/manager.ts";
import hasAuthParams from "../../utils/hasAuthParams.ts";
import type { DataFunctionArgs } from "../../utils/react-router/DataFunctionArgs.ts";

export const options = {
  removeAuthParams: ["code", "error", "iss", "session_state", "state"],
};

export default async function handleSigninCallback({
  request,
}: DataFunctionArgs) {
  const url = new URL(request.url);
  if (hasAuthParams(url)) {
    try {
      const userManager = await asyncUserManager.promise;
      await userManager.signinCallback();
    } catch {
      /* empty */
    }
    options.removeAuthParams.forEach((name) => url.searchParams.delete(name));

    throw replace(url.toString());
  }
}
