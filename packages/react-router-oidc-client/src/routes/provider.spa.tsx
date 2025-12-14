import {
  type ClientLoaderFunctionArgs,
  type MiddlewareFunction,
} from "react-router";
import handleSigninCallback from "../client/loaders/handleSigninCallback.ts";
import oidcClientMiddleware from "../client/oidcClientMiddleware.ts";
import { loader } from "./provider.ssr.ts";

export * from "./provider.tsx";
export { default } from "./provider.tsx";

export const clientMiddleware: MiddlewareFunction<any>[] = [
  oidcClientMiddleware,
];

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  await handleSigninCallback(args);
  return loader(args);
};
