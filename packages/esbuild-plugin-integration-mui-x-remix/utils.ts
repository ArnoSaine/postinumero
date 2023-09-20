import createCache from "@emotion/cache";
import { createContext } from "react";

export function createEmotionCache() {
  return createCache({ key: "css" });
}

export const ResetCacheContext = createContext(() => {});
