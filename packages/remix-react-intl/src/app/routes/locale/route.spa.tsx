import options from "@postinumero/remix-react-intl/options";
import { ActionFunctionArgs } from "@remix-run/node";

export const clientAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const locale = formData.get("locale") as string;

  if (locale) {
    localStorage.setItem(options.localStorageKey, locale);
  } else {
    localStorage.removeItem(options.localStorageKey);
  }

  return null;
};
