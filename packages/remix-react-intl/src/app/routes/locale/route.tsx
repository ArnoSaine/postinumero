import { ActionFunctionArgs } from "@remix-run/node";
import { commitSession, getSession } from "../../../sessions.js";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const locale = formData.get("locale") as string;

  if (locale) {
    session.set("locale", locale);
  } else {
    session.unset("locale");
  }

  return new Response(null, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
