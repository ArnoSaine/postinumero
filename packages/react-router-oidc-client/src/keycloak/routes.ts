import { defineAuthRoutes } from "../routes.ts";

export const createAuthRoutes = defineAuthRoutes({ provider: "keycloak/" });
