import type { MiddlewareFunction } from "react-router";
import { userContext } from "../user/context.ts";
import clientGetUser from "../user/getUser.ts";
import { setCookie } from "./cookie.ts";

const oidcSsrClientMiddleware: MiddlewareFunction<void | Response> = async ({
  context,
}) => {
  const user = await clientGetUser();
  context.set(userContext, user);
  await setCookie(user);
};

export default oidcSsrClientMiddleware;
