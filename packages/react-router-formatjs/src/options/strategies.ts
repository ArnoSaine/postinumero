import {
  CONFIG,
  type EnvironmentStrategy,
  type RequestedLocalesStrategy,
  type Strategy,
} from "@postinumero/react-router-formatjs/config";
import PLazy from "p-lazy";
import isVite from "../utils/is-vite.ts";

// Needs more investigation
// const strategyModules = import.meta.env
//   ? import.meta.glob<Strategy>("../strategies/*/*.js")
//   : {};

// Manually map strategy module paths to dynamic imports for Vite SSR support
const strategyModules: Record<string, () => Promise<Strategy<unknown>>> = {
  "../strategies/environment/reverseDomain.js": () =>
    import("../strategies/environment/reverseDomain.ts"),
  "../strategies/requestedLocales/cookie.js": () =>
    import("../strategies/requestedLocales/cookie.ts"),
  "../strategies/requestedLocales/acceptLanguageHeader.js": () =>
    import("../strategies/requestedLocales/acceptLanguageHeader.ts"),
  "../strategies/requestedLocales/localStorage.js": () =>
    import("../strategies/requestedLocales/localStorage.ts"),
  "../strategies/requestedLocales/navigatorLanguages.js": () =>
    import("../strategies/requestedLocales/navigatorLanguages.ts"),
  "../strategies/requestedLocales/searchParams.js": () =>
    import("../strategies/requestedLocales/searchParams.ts"),
  "../strategies/requestedLocales/sessionStorage.js": () =>
    import("../strategies/requestedLocales/sessionStorage.ts"),
};

const importer = isVite
  ? (file: string) => strategyModules[file]()
  : (file: string) =>
      import(/* @vite-ignore */ import.meta.dirname + "/" + file);

export const resolvedStrategiesPromise = PLazy.from<{
  environment: EnvironmentStrategy[];
  requestedLocales: RequestedLocalesStrategy[];
}>(async () =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(CONFIG.strategies).map(async ([name, strategies]) => [
        name,
        await Promise.all(
          strategies.map((strategy: Strategy) =>
            typeof strategy === "string"
              ? importer(`../strategies/${name}/${strategy}.js`)
              : strategy,
          ),
        ),
      ]),
    ),
  ),
);
