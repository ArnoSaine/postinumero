import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { methodPromise } from "./method.js";

export const clientAction = async (args: ClientActionFunctionArgs) =>
  (await methodPromise())?.clientAction?.(args) ?? args.serverAction();

export const action = async (args: ActionFunctionArgs) =>
  (await methodPromise())?.action?.(args);

export const clientLoader = async (args: ClientLoaderFunctionArgs) =>
  (await methodPromise())?.clientLoader?.(args) ?? args.serverLoader();

export const loader = async (args: LoaderFunctionArgs) =>
  (await methodPromise())?.loader?.(args);
