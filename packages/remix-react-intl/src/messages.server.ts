import type { LoaderFunctionArgs } from "@remix-run/node";
import { memoize } from "lodash-es";
import { readFile } from "node:fs/promises";
import path from "node:path";
import serverOptions from "virtual:@postinumero/remix-react-intl/options.server";
import { Messages } from "./createIntlConfigLoader.js";

const readMemoizedMessages = memoize(
  async (path: string) => JSON.parse(await readFile(path, "utf-8")) as Messages,
);

export const loadMessagesFromFile = (
  locale: string,
  routeId: string,
  _args: LoaderFunctionArgs,
) =>
  readMemoizedMessages(
    path.join(serverOptions.compiledTarget, locale, `${routeId}.json`),
  );
