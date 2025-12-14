import { User, type IdTokenClaims } from "oidc-client-ts";
import getTokenFromRequest from "../token/getTokenFromRequest.ts";
import verifyToken from "../token/verifyToken.ts";

export default async function getUserFromRequest(request: Request) {
  const token = await getTokenFromRequest(request);
  if (!token) return null;

  try {
    const jwtPayload = await verifyToken(token);

    return new User({
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
    });
  } catch (err) {
    console.error("Token verification failed", err);
    return null;
  }
}
