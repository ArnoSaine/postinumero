import serverOptions from "@postinumero/remix-react-intl/options.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { memoize } from "lodash-es";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Messages } from "./messages.js";

const readMemoizedMessages = memoize(
  async (path: string) => JSON.parse(await readFile(path, "utf-8")) as Messages,
);

export const loadMessagesFromFile = (
  locale: string,
  routeId: string,
  _args: LoaderFunctionArgs,
) =>
  readMemoizedMessages(
    path.join(serverOptions._compiledTargetAwaited, locale, `${routeId}.json`),
  );
