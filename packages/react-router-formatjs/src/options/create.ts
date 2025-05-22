import { DEFAULT_INTL_CONFIG } from "react-intl/src/utils.js";
import { environments, getMessages, locales } from "../config.ts";
import type {
  AvailableLocales,
  Environment,
  Options,
  RequestedLocales,
} from "../options.ts";
import { match } from "../utils/@formatjs/intl-localematcher.ts";

export async function createOptions(
  strategyResultLists: (
    | (
        | RequestedLocales
        | Environment
        | Promise<Environment>
        | Promise<RequestedLocales>
        | undefined
      )
    | Promise<RequestedLocales | Environment | undefined>
  )[][] = [[], []],
): Promise<Options> {
  const [environmentResults, requestedLocalesResults] = (await Promise.all(
    strategyResultLists.map((strategyResults) => Promise.all(strategyResults)),
  )) as [Environment[], RequestedLocales[]];
  const environment: Environment =
    environmentResults.find(Boolean) ??
    import.meta.env.VITE_environment ??
    null;
  const requestedLocales = [
    ...requestedLocalesResults.flat(),
    (import.meta.env.VITE_defaultLocale as string | undefined) ?? null,
    DEFAULT_INTL_CONFIG.defaultLocale as string,
  ];

  const availableLocales =
    environments.find(({ name }) => name === environment)?.locales ?? locales;

  const intlConfig = await createIntlConfig({
    requestedLocales,
    availableLocales,
    environment,
  });

  return {
    environment,
    // If first requested locale is available, use the actual resolved locale
    // Otherwise, use null for indicating the use of system locale or other default
    requestedLocale: requestedLocales[0] && intlConfig.locale,
    requestedLocales,
    availableLocales,
    intlConfig,
    raw: {
      environment: environmentResults,
      requestedLocales: requestedLocalesResults,
    },
  };
}

async function createIntlConfig({
  requestedLocales,
  availableLocales,
  environment,
}: {
  requestedLocales: RequestedLocales;
  availableLocales: AvailableLocales;
  environment: Environment;
}) {
  const matchingLocale = match(
    requestedLocales.filter(Boolean) as string[],
    availableLocales,
    DEFAULT_INTL_CONFIG.defaultLocale,
  );

  return {
    locale: matchingLocale,
    messages: await getMessages(matchingLocale, environment),
  };
}
