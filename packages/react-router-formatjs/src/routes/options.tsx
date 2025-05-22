import PLazy from "p-lazy";
import {
  type ClientActionFunctionArgs,
  type ClientLoaderFunctionArgs,
  type ShouldRevalidateFunction,
} from "react-router";
import { createIntl } from "../intl/create.ts";
import { clientContextRef, type Context } from "../middleware.ts";
import { CONFIG, type Options } from "../options.ts";
import { createOptions } from "../options/create.ts";
import { saveOptions } from "../options/save.ts";
import { resolvedStrategiesPromise } from "../options/strategies.ts";
import * as root from "/app/root";
import routerConfig from "/react-router.config.ts";

// No client middleware. Unlike server, we use the client loader to set the context value.

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formAction,
  defaultShouldRevalidate,
}) => {
  if (formAction !== CONFIG.route.path) {
    return false;
  }

  return defaultShouldRevalidate;
};

export const clientAction = async (args: ClientActionFunctionArgs) => {
  // Reset context value. Next client loader will set it again.
  clientContextRef.current = Promise.withResolvers<Context>();
  const result = await saveOptions(
    args,
    "clientAction",
    true,
    routerConfig.ssr ?? false,
  );
  if (result) {
    return result;
  }
  if (routerConfig.ssr) {
    return args.serverAction();
  }
};

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  const serverLoaderDataPromise = routerConfig.ssr
    ? PLazy.from<Options>(args.serverLoader)
    : undefined;
  const options = await createOptions(
    Object.entries(await resolvedStrategiesPromise).map(([name, strategies]) =>
      strategies.map(async ({ clientLoader, loader }, index) => {
        if (clientLoader) {
          return clientLoader(args, serverLoaderDataPromise);
        }

        if (routerConfig.ssr && loader) {
          return (await serverLoaderDataPromise)?.raw[name][index];
        }
      }),
    ),
  );

  clientContextRef.current.resolve({
    options,
    intl: createIntl(options.intlConfig),
  });

  return options;
};

// Ensure the clientLoader is called on initial load to provide the intlLoaderContext
clientLoader.hydrate = true;

export const ErrorBoundary = root.ErrorBoundary;
