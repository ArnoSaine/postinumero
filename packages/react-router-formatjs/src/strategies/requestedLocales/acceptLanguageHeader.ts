import { AcceptLanguage } from "@mjackson/headers";
import { type RequestedLocalesStrategy } from "../../options.ts";

export const loader: RequestedLocalesStrategy["loader"] = (args) =>
  new AcceptLanguage(args.request.headers.get("Accept-Language") ?? undefined)
    .languages;
