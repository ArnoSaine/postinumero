import type {
  ActionFunctionArgs,
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
} from "react-router";

export type DataFunctionArgs =
  | ActionFunctionArgs
  | ClientActionFunctionArgs
  | ClientLoaderFunctionArgs
  | LoaderFunctionArgs;
