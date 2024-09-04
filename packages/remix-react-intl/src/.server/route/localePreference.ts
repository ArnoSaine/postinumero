import { options } from "@postinumero/remix-react-intl";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

// Returns an empty string if the locale preference is unset, making it safe for
// use as a React key in a locale selector component.
export type LocalePreferenceLoaderFunction = (
  args: LoaderFunctionArgs,
) => string | Promise<string>;

const method = import(
  `../../localePreference/methods/.server/${options._localePreferenceMethodAwaited}.js`
);

export const actLocalePreference = async (args: ActionFunctionArgs) =>
  (await method).action(args);

export const loadLocalePreference = async (args: LoaderFunctionArgs) =>
  (await method).loader(args);
