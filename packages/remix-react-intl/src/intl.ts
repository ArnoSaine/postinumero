import options from "@postinumero/remix-react-intl/options";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  MetaArgs,
} from "@remix-run/react";
import { createIntl, IntlConfig } from "react-intl";
import handleError from "./handleError.js";
import { loadIntlConfig } from "./intlConfig.js";

export function metaIntl(args: MetaArgs) {
  const routeId = options.singleOutput
    ? "root"
    : // TODO: Get matching routeId and parent routes from args.location. Merge messages with parent route messages and root route messages.
      "root";
  const match = args.matches.find((match) => match.id === routeId);
  const intlConfig = (match?.data as { intl: IntlConfig | undefined })?.intl;

  return (
    intlConfig &&
    createIntl({
      ...intlConfig,
      onError: handleError,
    })
  );
}

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
