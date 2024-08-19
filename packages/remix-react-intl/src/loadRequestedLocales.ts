import { LoaderFunctionArgs } from "@remix-run/node";
import { orderBy } from "lodash-es";
import { clientOnly$, serverOnly$ } from "vite-env-only";

const server = serverOnly$(
  (args: LoaderFunctionArgs) =>
    orderBy(
      args.request.headers
        .get("Accept-Language")
        ?.split(",")
        .map((acceptLanguage) => acceptLanguage.trim())
        .map(
          (acceptLanguage) =>
            acceptLanguage
              .split(";")
              .map((localeOrQuality) => localeOrQuality.trim()) as [
              string,
              string | undefined,
            ],
        )
        .filter(([locale]) => locale)
        .map(
          (
            [locale, quality]: [string, string | undefined],
            index,
            localesAndQualities,
          ) => ({
            locale,
            quality:
              quality ??
              localesAndQualities
                .slice(index)
                .find(([, quality]) => quality)?.[1],
          }),
        )
        .map(({ locale, quality }) => ({
          locale,
          quality: Number(quality?.split("=")[1] ?? 0),
        })),
      "quality",
      "desc",
    ).map(({ locale }) => locale) ?? [],
);

const client = clientOnly$(() => navigator.languages);

const loadRequestedLocales = (server ?? client)!;

export default loadRequestedLocales;
