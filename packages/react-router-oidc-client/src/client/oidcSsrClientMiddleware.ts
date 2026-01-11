import type { MiddlewareFunction } from "react-router";
import { userContext } from "../user/context.ts";
import { userManager } from "../user/manager.ts";
import { setCookie } from "./cookie.ts";
import handleExpiredUserSession from "./handleExpiredUserSession.ts";

const oidcSsrClientMiddleware: MiddlewareFunction<void | Response> = async ({
  context,
}) => {
  await handleExpiredUserSession();
  const user = await userManager.getUser();
  context.set(userContext, user);
  await setCookie(user);
};

export default oidcSsrClientMiddleware;
