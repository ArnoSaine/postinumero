import { type RequestedLocalesStrategy } from "@postinumero/react-router-formatjs/config";
import PLazy from "p-lazy";
import {
  createCookieSessionStorage,
  replace,
  type SessionIdStorageStrategy,
} from "react-router";
import type { Writable } from "type-fest";

export const cookie: Writable<NonNullable<SessionIdStorageStrategy["cookie"]>> =
  {
    name: "locale",
    httpOnly: true,
    maxAge: 400 * 24 * 60 * 60, // 400 days
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret1"],
    secure: true,
  };

const cookieSessionStoragePromise = PLazy.from(() =>
  createCookieSessionStorage<{ requestedLocales: string[] }>({ cookie }),
);

export const action: RequestedLocalesStrategy["action"] = async (
  values,
  { currentUrl },
  args,
) => {
  const { getSession, commitSession, destroySession } =
    await cookieSessionStoragePromise;
  const session = await getSession(args.request.headers.get("Cookie"));
  const valuesFiltered = values.filter(Boolean);
  const destroy = valuesFiltered.length === 0;
  if (!destroy) {
    session.set("requestedLocales", valuesFiltered);
  }
  return replace(currentUrl.toString(), {
    headers: {
      "Set-Cookie": destroy
        ? await destroySession(session)
        : await commitSession(session),
    },
  });
};

export const loader: RequestedLocalesStrategy["loader"] = async (args) => {
  const { getSession } = await cookieSessionStoragePromise;
  const session = await getSession(args.request.headers.get("Cookie"));
  const locales = session.get("requestedLocales");
  return locales?.length ? locales : [null];
};
