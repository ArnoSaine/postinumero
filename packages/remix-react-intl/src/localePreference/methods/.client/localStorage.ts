import { options } from "@postinumero/remix-react-intl";
import { ClientActionFunctionArgs } from "@remix-run/react";
import { LocalePreferenceClientLoaderFunction } from "../../../.client/route/localePreference.js";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  const locale = formData.get("locale") as string;

  if (locale) {
    localStorage.setItem(options.localStorageKey, locale);
  } else {
    localStorage.removeItem(options.localStorageKey);
  }
};

export const clientLoader: LocalePreferenceClientLoaderFunction = () =>
  localStorage.getItem(options.localStorageKey) ?? "";
