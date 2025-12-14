import { createRemoteJWKSet } from "jose";

export const asyncJWKS =
  Promise.withResolvers<ReturnType<typeof createRemoteJWKSet>>();
