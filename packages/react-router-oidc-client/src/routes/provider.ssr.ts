import type { LoaderFunctionArgs } from "react-router";
import {
  type ClientLoaderFunctionArgs,
  type MiddlewareFunction,
} from "react-router";
import handleSigninCallback from "../client/loaders/handleSigninCallback.ts";
import oidcSsrClientMiddleware from "../client/oidcSsrClientMiddleware.ts";
import { loadIsAuthenticated } from "../is.ts";
import loadUser from "../loaders/loadUser.ts";
import oidcSsrMiddleware from "../server/oidcSsrMiddleware.ts";
import requestMiddleware from "../utils/react-router/requestMiddleware.ts";

export * from "./provider.tsx";
export { default } from "./provider.tsx";

export const middleware: MiddlewareFunction<any>[] = [
  oidcSsrMiddleware,
  requestMiddleware,
];

export const clientMiddleware: MiddlewareFunction<any>[] = [
  oidcSsrClientMiddleware,
];

export const loader = async (args: LoaderFunctionArgs) => ({
  ...(await loadIsAuthenticated(args)),
  user: loadUser(args),
});

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  await handleSigninCallback(args);
  return args.serverLoader();
};

// For redirect login flow signin callback
clientLoader.hydrate = true;
