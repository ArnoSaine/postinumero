import { trySigninSilent, userManager } from "../user/manager.ts";

// Token refresh is not started automatically by oidc-client-ts when access token is expired
// https://github.com/authts/oidc-client-ts/issues/2012
export default async function handleExpiredUserSession() {
  const user = await userManager.getUser();
  if (user?.expired) {
    await trySigninSilent();
  }
}
