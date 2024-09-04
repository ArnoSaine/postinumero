import { options } from "@postinumero/remix-react-intl";
import { LoaderFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { memoize } from "lodash-es";
import { IntlConfig } from "react-intl";

export type Messages = IntlConfig["messages"];

const fetchMemoizedMessages = memoize(
  async (url: string): Promise<Messages> => {
    const response = await fetch(url);

    return response.json();
  },
);

export const loadMessagesFromFetch = (
  locale: string,
  routeId: string,
  args: ClientLoaderFunctionArgs | LoaderFunctionArgs,
) =>
  fetchMemoizedMessages(
    new URL(
      `/${options.compiledTargetPublicPath}/${locale}/${routeId}.json`,
      args.request.url,
    ).toString(),
  );
