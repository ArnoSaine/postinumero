import { unauthorized } from "assert-response";
import { camelCase } from "lodash-es";
import { ErrorResponse, type UserManager } from "oidc-client-ts";
import invariant from "tiny-invariant";

export const asyncUserManager = Promise.withResolvers<UserManager>();

let userManagerOrNull: UserManager | null = null;

(async () => {
  userManagerOrNull = await asyncUserManager.promise;
})();

export const userManager = new Proxy(
  {},
  {
    get(_, prop: keyof UserManager) {
      invariant(
        userManagerOrNull,
        `UserManager not initialized yet. Tried to access property "${String(prop)}"`,
      );
      return userManagerOrNull[prop];
    },
  },
) as UserManager;

export async function performUserManagerAction(
  type: "signin" | "signout",
  { intent, ...data }: any,
) {
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
