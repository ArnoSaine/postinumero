import {
  ActionFunctionArgs,
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";
import { LocalePreferenceLoaderFunction } from "../method.js";

type SessionData = {
  locale: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage!<SessionData>({
    // TODO: from options
    cookie: {
      name: "__locale",
      httpOnly: true,
      maxAge: 400 * 24 * 60 * 60, // 400 days
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: true,
    },
  });

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const locale = formData.get("locale") as string;

  if (locale) {
    session.set("locale", locale);
  }

  return redirect(request.headers.get("referer") ?? "/", {
    headers: {
      "Set-Cookie": locale
        ? await commitSession(session)
        : await destroySession(session),
    },
  });
};

export const loader: LocalePreferenceLoaderFunction = async (args) => {
  const session = await getSession(args.request.headers.get("Cookie"));

  return session.get("locale") ?? "";
};
