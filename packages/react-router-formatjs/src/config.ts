import type { IntlConfig, ResolvedIntlConfig } from "react-intl";
import {
  type ActionFunctionArgs,
  type ClientActionFunctionArgs,
  type ClientLoaderFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import routerConfig from "./utils/react-router/config.ts";

export type DataFunctionArgs =
  | ActionFunctionArgs
  | LoaderFunctionArgs
  | ClientActionFunctionArgs
  | ClientLoaderFunctionArgs;

export interface Strategy<T = unknown> {
  action?: ActionFunction;
  clientAction?: ClientActionFunction;
  clientLoader?: ClientLoaderFunction<T>;
  loader?: LoaderFunction<T>;
}
export type EnvironmentStrategy = Strategy<Environment>;
export type RequestedLocalesStrategy = Strategy<RequestedLocales>;

export type EnvironmentStrategyName = "reverseDomain";
export type RequestedLocalesStrategyName =
  | "cookie"
  | "localStorage"
  | "sessionStorage"
  | "searchParams"
  | "acceptLanguageHeader"
  | "navigatorLanguages";

export type ActionFunction<T = unknown> = (
  values: string[],
  params: {
    formData: FormData;
    currentUrl: URL;
  },
  args: ActionFunctionArgs,
) => T | Promise<T>;
export type ClientActionFunction<T = unknown> = (
  values: string[],
  params: {
    formData: FormData;
    currentUrl: URL;
  },
  args: ClientActionFunctionArgs,
) => T | Promise<T>;
export type ClientLoaderFunction<T = unknown> = (
  args: ClientLoaderFunctionArgs,
  serverLoaderDataPromise?: Promise<Options>,
) => T | Promise<T>;
export type LoaderFunction<T = unknown> = (
  args: LoaderFunctionArgs,
) => T | Promise<T>;

export type Environment = string | null;
export type RequestedLocale = string | null;
export type RequestedLocales = readonly RequestedLocale[];
export type AvailableLocales = readonly string[];

export interface Options {
  environment: Environment;
  requestedLocale: RequestedLocale;
  requestedLocales: RequestedLocales;
  availableLocales: AvailableLocales;
  intlConfig: IntlConfig & { messages: ResolvedIntlConfig["messages"] };
  raw: {
    environment: Environment[];
    requestedLocales: RequestedLocales[];
  };
}

export type StrategyType = keyof Strategies;

interface Strategies {
  environment: (EnvironmentStrategy | EnvironmentStrategyName)[];
  requestedLocales: (RequestedLocalesStrategy | RequestedLocalesStrategyName)[];
}

export interface Config {
  keys: Record<"currentUrl", string>;
  route: {
    id: string;
    path: string;
  };
  strategies: Strategies;
  strategyTypeKeys: Record<StrategyType, string>;
}

export const CONFIG: Config = {
  keys: {
    currentUrl: "currentUrl",
  },
  route: {
    id: "@postinumero/react-router-formatjs/options",
    path: "/__locale",
  },
  strategies: {
    environment: ["reverseDomain"],
    requestedLocales: routerConfig.ssr
      ? ["cookie", "acceptLanguageHeader", "navigatorLanguages"]
      : ["localStorage", "navigatorLanguages"],
  },
  strategyTypeKeys: {
    environment: "environment",
    requestedLocales: "locale",
  },
};
