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
      : // TODO: get matching routeId from args.request.url
        "root",
    args,
  );

  return createIntl({
    onError: handleError,
    ...intlConfig,
  });
}
