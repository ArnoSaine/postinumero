import { createFromLoader } from "@arnosaine/is";
import type { LoaderFunctionArgs } from "react-router";
import config from "./config.ts";
import loadUser from "./loaders/loadUser.ts";

const [IsAuthenticated, useIsAuthenticated, loadIsAuthenticated] =
  createFromLoader(
    (args: LoaderFunctionArgs) => ({
      authenticated: Boolean(loadUser(args)),
    }),
    { authenticated: true },
    { prop: "__isAuthenticated", routeId: config.route.id },
  );

export { IsAuthenticated, loadIsAuthenticated, useIsAuthenticated };
