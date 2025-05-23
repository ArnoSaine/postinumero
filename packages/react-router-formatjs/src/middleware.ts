import { type IntlShape } from "react-intl";
import {
  unstable_createContext,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { createIntl } from "./intl/create.ts";
import type { DataFunctionArgs, Options } from "./options.ts";
import { createOptions } from "./options/create.ts";
import { resolvedStrategiesPromise } from "./options/strategies.ts";
import isServer from "./utils/is-server.ts";
import routerConfig from "./utils/react-router/config.ts";

export interface Context {
  options: Options;
  intl: IntlShape;
}

// For client loaders and client actions
export const clientContextRef: {
  current: PromiseWithResolvers<Context>;
} = {
  current: Promise.withResolvers<Context>(),
};

export const intlContext = unstable_createContext<Context>();

export const intlMiddleware = async (
  args: ActionFunctionArgs | LoaderFunctionArgs,
) => {
  args.context.set(intlContext, createIntlContext(args));
};

export const loadIntlContext = async (args: DataFunctionArgs) =>
  isServer
    ? routerConfig.future?.unstable_middleware
      ? // Get value from context, set by the middleware
        (args.context.get(intlContext) as Context)
      : // Create a new context value
        createIntlContext(args)
    : clientContextRef.current.promise;

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
