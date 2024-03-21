import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  locale: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    // TODO: from options
    cookie: {
      name: "__locale",
      httpOnly: true,
      maxAge: 60,
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: true,
    },
  });

export { commitSession, destroySession, getSession };
