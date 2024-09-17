import { options } from "@postinumero/remix-react-intl";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

// Returns an empty string if the locale preference is unset, making it safe for
// use as a React key in a locale selector component.
export type LocalePreferenceLoaderFunction = (
  args: LoaderFunctionArgs,
) => string | Promise<string>;

const methods = {
  session: () => import("../../localePreference/methods/.server/session.js"),
};

const method =
  methods[options._localePreferenceMethodAwaited as keyof typeof methods];
invariant(method);

export const actLocalePreference = async (args: ActionFunctionArgs) =>
  (await method()).action(args);

export const loadLocalePreference = async (args: LoaderFunctionArgs) =>
  (await method()).loader(args);
