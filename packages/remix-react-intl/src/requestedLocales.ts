import { AcceptLanguage } from "@mjackson/headers";
import { LoaderFunctionArgs } from "@remix-run/node";
import { clientOnly$, serverOnly$ } from "vite-env-only";

const server = serverOnly$(
  (args: LoaderFunctionArgs) =>
    new AcceptLanguage(args.request.headers.get("Accept-Language") ?? undefined)
      .languages,
);

const client = clientOnly$(() => navigator.languages);

export const loadRequestedLocales = (server ?? client)!;
