import type { User } from "oidc-client-ts";
import createAsyncLocalStorageContext from "../../utils/react-router/createAsyncLocalStorageContext.ts";

export const asyncUserStorage = createAsyncLocalStorageContext<User | null>();
