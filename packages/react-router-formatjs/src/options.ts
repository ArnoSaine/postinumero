import { AcceptLanguage } from "@mjackson/headers";
import type {
  ActionFunctionArgs,
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
} from "react-router";

export type DataFunctionArgs =
  | ActionFunctionArgs
  | LoaderFunctionArgs
  | ClientActionFunctionArgs
  | ClientLoaderFunctionArgs;

export interface Options {
  requestedLocales: string[];
  environment?: string | null;
}

export const options = {
  loadOptions: async (args: DataFunctionArgs) => {
    const { languages } = new AcceptLanguage(
      args.request.headers.get("Accept-Language") ?? undefined,
    );

    return {
      requestedLocales: [...languages, ...navigator.languages],
    } as Options;
  },
};
