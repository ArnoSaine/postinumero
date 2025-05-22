import PLazy from "p-lazy";
import {
  CONFIG,
  type EnvironmentStrategy,
  type EnvironmentStrategyName,
  type RequestedLocalesStrategy,
  type RequestedLocalesStrategyName,
  type Strategy,
} from "../options.ts";

const strategyModules = {
  environment: (strategy: EnvironmentStrategyName) =>
    import(
      /* @vite-ignore */
      `../strategies/environment/${strategy}.js`
    ) as Promise<EnvironmentStrategy>,
  requestedLocales: (strategy: RequestedLocalesStrategyName) =>
    import(
      /* @vite-ignore */
      `../strategies/requestedLocales/${strategy}.js`
    ) as Promise<RequestedLocalesStrategy>,
} as const;

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
              ? strategyModules[name](strategy)
              : strategy,
          ),
        ),
      ]),
    ),
  ),
);
