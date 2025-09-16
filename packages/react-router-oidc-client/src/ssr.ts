import type { DataFunctionArgs } from "@arnosaine/is";
import { getUser, options } from "@postinumero/react-router-oidc-client";
import { asyncUserManager } from "@postinumero/react-router-oidc-client/user";
import { parse } from "cookie";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { type IdTokenClaims, User } from "oidc-client-ts";
import type { MiddlewareFunction } from "react-router";

export function getTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const cookies = parse(cookieHeader ?? "");
  return cookies[options.cookie] || null;
}

export const asyncJWKS =
  Promise.withResolvers<ReturnType<typeof createRemoteJWKSet>>();

export async function verifyToken(token: string) {
  const userManager = await asyncUserManager.promise;

  try {
    const { payload } = await jwtVerify(
      token,
      await asyncJWKS.promise,
      options.jwtVerifyOptions(userManager.settings),
    );

    return payload;
  } catch (err) {
    console.error("Token verification failed", err);
    return null;
  }
}

export const loadUser = async (args: DataFunctionArgs) => {
  const token = getTokenFromRequest(args.request);
  const userManager = await asyncUserManager.promise;

  if (token) {
    const jwtPayload = await verifyToken(token);

    if (jwtPayload) {
      await userManager.storeUser(
        new User({
          //id_token?: string;
          session_state: jwtPayload.sid as string,
          access_token: token,
          //refresh_token?: string;
          token_type: "Bearer",
          scope: jwtPayload.scope as string,
          profile: jwtPayload as IdTokenClaims,
          expires_at: jwtPayload.exp,
          // userState?: unknown;
          // url_state?: string;
        }),
      );
      return;
    }
  }

  await userManager.removeUser();
};

export const oidc_ssr_middleware: MiddlewareFunction = loadUser;

export const oidc_ssr_clientMiddleware: MiddlewareFunction = async () => {
  const user = await getUser();
  document.cookie = `${options.cookie}=${user?.access_token ?? ""}`;
};
