import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { createIntl } from "react-intl";
import options from "virtual:@postinumero/remix-react-intl/options";
import loadIntlConfig, { handleError } from "./loadIntlConfig.js";

export default async function loadIntl(
  args:
    | ActionFunctionArgs
    | ClientActionFunctionArgs
    | ClientLoaderFunctionArgs
    | LoaderFunctionArgs,
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
