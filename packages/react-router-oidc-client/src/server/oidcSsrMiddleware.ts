import type { MiddlewareFunction } from "react-router";
import { userContext } from "../user/context.ts";
import getUserFromRequest from "../user/getUserFromRequest.ts";
import { asyncUserStorage } from "../user/server/asyncLocalStorage.ts";

const oidcSsrMiddleware: MiddlewareFunction<void | Response> = async (
  { context, request },
  next,
) => {
  const user = await getUserFromRequest(request);
  context.set(userContext, user); 
  return asyncUserStorage.run(user, next);
};

export default oidcSsrMiddleware;
