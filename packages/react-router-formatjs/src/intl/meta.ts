import type { IntlConfig, IntlShape } from "@formatjs/intl";
import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from "react-router";
import invariant from "tiny-invariant";
import { createIntl } from "./index.ts";

type IntlRouteLoader = (
  args: LoaderFunctionArgs | ClientLoaderFunctionArgs,
) => Promise<{ intl: IntlShape }>;

export function metaIntl(args: any) {
  const match = (
    args as MetaArgs<unknown, { intlRoute: IntlRouteLoader }>
  ).matches.find(({ data }) => data?.intl);

  invariant(
    match,
    "metaIntl: No route match found for intl. Make sure to return intl from the loader.",
  );

  return createIntl(match.data.intl as IntlConfig);
}
