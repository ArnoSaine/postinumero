import { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientActionFunction,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import options from "virtual:@postinumero/remix-react-intl/options";
import { clientOnly$, serverOnly$ } from "vite-env-only";

// Returns an empty string if the locale preference is unset, making it safe for
// use as a React key in a locale selector component.
export type LocalePreferenceLoaderFunction = (
  args: LoaderFunctionArgs,
) => string | Promise<string>;
export type LocalePreferenceClientLoaderFunction = (
  args: ClientLoaderFunctionArgs,
) => string | Promise<string>;

const methods = {
  "localStorage.client": () =>
    clientOnly$(import("./methods/localStorage.client.js")),
  "session.server": () => serverOnly$(import("./methods/session.server.js")),
} as const;

export const methodPromise = methods[
  options.localePreferenceMethod
] as any as () => {
  action: ActionFunction;
  loader: LocalePreferenceLoaderFunction;
  clientAction: ClientActionFunction;
  clientLoader: LocalePreferenceClientLoaderFunction;
};
