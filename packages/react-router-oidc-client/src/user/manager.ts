import { unauthorized } from "assert-response";
import { camelCase } from "lodash-es";
import { ErrorResponse, type UserManager } from "oidc-client-ts";

export const asyncUserManager = Promise.withResolvers<UserManager>();

export async function performUserManagerAction(
  type: "signin" | "signout",
  { intent, ...data }: any,
) {
  const userManager: UserManager = await asyncUserManager.promise;

  const method = camelCase(`${type}-${intent}`) as
    | "signinPopup"
    | "signinRedirect"
    | "signinResourceOwnerCredentials"
    | "signinSilent"
    | "signoutPopup"
    | "signoutRedirect"
    | "signoutSilent";

  try {
    await userManager[method](data);
  } catch (error) {
    if (error instanceof ErrorResponse) {
      unauthorized(true, JSON.stringify(error), {
        headers: { "Content-Type": "application/json" },
      });
    }

    throw error;
  }
}
