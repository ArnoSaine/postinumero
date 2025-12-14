import type { ClientLoaderFunctionArgs } from "react-router";
import handleSigninCallback from "../../client/loaders/handleSigninCallback.ts";
import { loader } from "./provider.ssr.ts";

export * from "../../routes/provider.spa.ts";
export { default } from "../../routes/provider.spa.ts";

export * from "./provider.ts";

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  await handleSigninCallback(args);
  return loader(args);
};
