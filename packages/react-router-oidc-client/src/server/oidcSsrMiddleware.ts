import type { MiddlewareFunction } from "react-router";
import { userContext } from "../user/context.ts";
import getUserFromRequest from "../user/getUserFromRequest.ts";

const oidcSsrMiddleware: MiddlewareFunction<void | Response> = async ({
  context,
  request,
}) => {
  const user = await getUserFromRequest(request);
  context.set(userContext, user);
};

export default oidcSsrMiddleware;
