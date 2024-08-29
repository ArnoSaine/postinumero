import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { createIntl } from "react-intl";
import options from "virtual:@postinumero/remix-react-intl/options";
import handleError from "./handleError.js";
import { loadIntlConfig } from "./intlConfig.js";

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
