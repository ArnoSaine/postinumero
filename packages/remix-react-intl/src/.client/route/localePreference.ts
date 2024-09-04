import { options } from "@postinumero/remix-react-intl";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";

// Returns an empty string if the locale preference is unset, making it safe for
// use as a React key in a locale selector component.
export type LocalePreferenceClientLoaderFunction = (
  args: ClientLoaderFunctionArgs,
) => string | Promise<string>;

const method = import(
  `../../localePreference/methods/.client/${options._localePreferenceMethodAwaited}.js`
);

export const actLocalePreference = async (args: ClientActionFunctionArgs) =>
  (await method).clientAction(args);

export const loadLocalePreference = async (args: ClientLoaderFunctionArgs) =>
  (await method).clientLoader(args);
