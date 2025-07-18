import {
  CONFIG,
  type EnvironmentStrategy,
  type RequestedLocalesStrategy,
  type Strategy,
} from "@postinumero/react-router-formatjs/config";
import PLazy from "p-lazy";

const strategyModules = import.meta.env
  ? import.meta.glob<Strategy>("../strategies/*/*.js")
  : {};

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
              ? strategyModules[`../strategies/${name}/${strategy}.js`]()
              : strategy,
          ),
        ),
      ]),
    ),
  ),
);
