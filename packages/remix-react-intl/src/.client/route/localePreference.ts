import { options } from "@postinumero/remix-react-intl";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import invariant from "tiny-invariant";

// Returns an empty string if the locale preference is unset, making it safe for
// use as a React key in a locale selector component.
export type LocalePreferenceClientLoaderFunction = (
  args: ClientLoaderFunctionArgs,
) => string | Promise<string>;

const methods = {
  localStorage: () =>
    import("../../localePreference/methods/.client/localStorage.js"),
};

const method =
  methods[options._localePreferenceMethodAwaited as keyof typeof methods];
invariant(method);

export const actLocalePreference = async (args: ClientActionFunctionArgs) =>
  (await method()).clientAction(args);

export const loadLocalePreference = async (args: ClientLoaderFunctionArgs) =>
  (await method()).clientLoader(args);
