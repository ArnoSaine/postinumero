import { AcceptLanguage } from "@mjackson/headers";
import { type RequestedLocalesStrategy } from "@postinumero/react-router-formatjs/config";

export const loader: RequestedLocalesStrategy["loader"] = (args) =>
  new AcceptLanguage(args.request.headers.get("Accept-Language") ?? undefined)
    .languages;
