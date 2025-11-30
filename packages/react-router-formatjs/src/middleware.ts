import type {
  DataFunctionArgs,
  Options,
} from "@postinumero/react-router-formatjs/config";
import { type IntlShape } from "react-intl";
import {
  createContext,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { createIntl } from "./intl/create.ts";
import { createOptions } from "./options/create.ts";
import { resolvedStrategiesPromise } from "@postinumero/react-router-formatjs/options/strategies";
import isServer from "./utils/is-server.ts";
import routerConfig from "./utils/react-router/config.ts";

export interface Context {
  options: Options;
  intl: IntlShape;
}

declare global {
  var __REACT_ROUTER_FORMATJS_CLIENT_CONTEXT__: PromiseWithResolvers<Context>;
}

// For client loaders and client actions
globalThis.__REACT_ROUTER_FORMATJS_CLIENT_CONTEXT__ ??=
  Promise.withResolvers<Context>();

export const intlContext = createContext<Context>();

export const intlMiddleware = async (
  args: ActionFunctionArgs | LoaderFunctionArgs,
) => {
  args.context.set(intlContext, createIntlContext(args));
};

export const loadIntlContext = (args: DataFunctionArgs) =>
  isServer
    ? routerConfig.future?.v8_middleware
      ? // Get value from context, set by the middleware
        (args.context.get(intlContext) as Context)
      : // Create a new context value
        createIntlContext(args)
    : globalThis.__REACT_ROUTER_FORMATJS_CLIENT_CONTEXT__.promise;

async function createIntlContext(
  args: ActionFunctionArgs | LoaderFunctionArgs,
) {
  const options = await createOptions(
    Object.values(await resolvedStrategiesPromise).map((strategies) =>
      strategies.map(({ loader }) => loader?.(args)),
    ),
  );

  return {
    options,
    intl: createIntl(options.intlConfig),
  } as Context;
}
