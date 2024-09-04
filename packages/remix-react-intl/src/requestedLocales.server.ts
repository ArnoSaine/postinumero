import { AcceptLanguage } from "@mjackson/headers";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loadRequestedLocales = async (args: LoaderFunctionArgs) =>
  new AcceptLanguage(args.request.headers.get("Accept-Language") ?? undefined)
    .languages;
