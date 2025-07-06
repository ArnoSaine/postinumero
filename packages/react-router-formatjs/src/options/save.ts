import {
  CONFIG,
  type ActionFunction,
  type ClientActionFunction,
} from "@postinumero/react-router-formatjs/config";
import { valid } from "assert-response";
import type {
  ActionFunctionArgs,
  ClientActionFunctionArgs,
} from "react-router";
import isServer from "../utils/is-server.ts";
import { resolvedStrategiesPromise } from "./strategies.ts";

export async function saveOptions(
  args: ActionFunctionArgs | ClientActionFunctionArgs,
  actionType: "action" | "clientAction",
  shouldCloneRequest: boolean,
  allowEmptyStrategies: boolean,
) {
  const formData = shouldCloneRequest
    ? await args.request.clone().formData()
    : await args.request.formData();

  const entries = Object.entries(CONFIG.strategyTypeKeys);
  const key = entries.find(([, keyValue]) => formData.has(keyValue));

  valid(
    key,
    `FormData must contain one of the keys: ${Object.values(CONFIG.strategyTypeKeys).join(", ")}`,
  );

  const resolvedStrategies = await resolvedStrategiesPromise;
  const [keyName, keyValue] = key;

  const strategyActions = resolvedStrategies[keyName]
    .map((s) => s[actionType])
    .filter(Boolean) as (typeof actionType extends "action"
    ? ActionFunction
    : ClientActionFunction)[];

  if (!allowEmptyStrategies) {
    valid(strategyActions.length, `No strategy actions found for '${keyName}'`);
  }

  const values = formData.getAll(keyValue) as string[];
  const currentUrl = isServer
    ? (new URL(args.request.url).searchParams.get(CONFIG.keys.currentUrl) ??
      (formData.get(CONFIG.keys.currentUrl) as string) ??
      args.request.headers.get("referer") ??
      "/")
    : location.href;
  const context = {
    formData,
    currentUrl: new URL(
      currentUrl,
      currentUrl.startsWith("http")
        ? undefined
        : isServer
          ? args.request.url
          : location.origin,
    ),
  };

  for (const strategyAction of strategyActions) {
    const result = await strategyAction(values, context, args as any);
    if (result) {
      return result;
    }
  }
}
