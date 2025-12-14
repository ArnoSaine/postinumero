import { authorized } from "assert-response";
import { loadIsAuthenticated } from "../is.ts";
import type { DataFunctionArgs } from "../utils/react-router/DataFunctionArgs.ts";
import loadUser from "./loadUser.ts";

export default async function authenticated(args: DataFunctionArgs) {
  const user = loadUser(args);

  const isAuthenticated = await loadIsAuthenticated(args);

  authorized(isAuthenticated({ authenticated: true }), "");

  return user!;
}
