import type { LoaderFunctionArgs } from "@remix-run/node";
import { readFile } from "node:fs/promises";
import path from "node:path";
import serverOptions from "virtual:@postinumero/remix-react-intl/options.server";
import { Messages } from "./createIntlConfigLoader.js";

export const loadMessagesFromFile = async (
  locale: string,
  routeId: string,
  _args: LoaderFunctionArgs,
) =>
  JSON.parse(
    await readFile(
      path.join(serverOptions.compiledTarget, locale, `${routeId}.json`),
      "utf-8",
    ),
  ) as Messages;
