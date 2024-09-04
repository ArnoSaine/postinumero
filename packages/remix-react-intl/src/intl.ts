import { options } from "@postinumero/remix-react-intl";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  MetaArgs,
} from "@remix-run/react";
import { createIntl } from "react-intl";
import { clientOnly$, serverOnly$ } from "vite-env-only";
import handleError from "./handleError.js";
import { Loader } from "./route.js";

export function metaIntl(args: MetaArgs) {
  const _args = args as MetaArgs<Loader, Record<string, Loader>>;
  const intlConfigs = _args.matches
    .map(({ data }) => data?.intl.config)
    .filter(Boolean);

  return intlConfigs.length
    ? createIntl(
        Object.assign(
          { onError: handleError },
          ..._args.matches.map(({ data }) => data?.intl.config).filter(Boolean),
        ),
      )
    : undefined;
}

const server = serverOnly$(
  async (
    ...args: Parameters<
      (typeof import("./intlConfig.server.js"))["loadIntlConfig"]
    >
  ) => (await import("./intlConfig.server.js")).loadIntlConfig(...args),
);

const client = clientOnly$(
  async (
    ...args: Parameters<
      (typeof import("./intlConfig.client.js"))["loadIntlConfig"]
    >
  ) => (await import("./intlConfig.client.js")).loadIntlConfig(...args),
);

export const loadIntlConfig = (server ?? client)!;

export async function loadIntl(
  args:
    | ActionFunctionArgs
    | LoaderFunctionArgs
    | ClientActionFunctionArgs
    | ClientLoaderFunctionArgs,
) {
  const intlConfig = await (loadIntlConfig as any)(
    options.singleOutput
      ? "root"
      : // TODO: Get matching routeId and parent routes from args.request.url. Merge messages with parent route messages and root route messages.
        "root",
    args,
  );

  return createIntl({
    onError: handleError,
    ...intlConfig,
  });
}
