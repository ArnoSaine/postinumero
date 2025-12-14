import type { User } from "oidc-client-ts";
import { createContext } from "react-router";

// No default value, as the middleware is expected to set it. Also to distinguish
// between "not set" and "null" (no user).
export const userContext = createContext<User | null>();
