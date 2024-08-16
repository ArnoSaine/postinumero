import "@formatjs/intl-durationformat/polyfill.js";
import { LoaderFunctionArgs } from "@remix-run/node";
import options from "virtual:@postinumero/remix-react-intl/options";
import { serverOnly$ } from "vite-env-only";
import { getSession } from "./sessions.js";

const loadLocalePreference =
  serverOnly$(async (args: LoaderFunctionArgs) => {
    const session = await getSession(args.request.headers.get("Cookie"));

    return session.get("locale");
  }) ?? (() => localStorage.getItem(options.localStorageKey) ?? undefined);

export default loadLocalePreference;
