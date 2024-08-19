import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { methodPromise } from "./method.js";

export const clientAction = async (args: ClientActionFunctionArgs) =>
  (await methodPromise())?.clientAction?.(args);

export const clientLoader = async (args: ClientLoaderFunctionArgs) =>
  (await methodPromise())?.clientLoader?.(args);
