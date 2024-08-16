import { ClientActionFunctionArgs } from "@remix-run/react";
import options from "virtual:@postinumero/remix-react-intl/options";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  const locale = formData.get("locale") as string;

  if (locale) {
    localStorage.setItem(options.localStorageKey, locale);
  } else {
    localStorage.removeItem(options.localStorageKey);
  }

  return null;
};
