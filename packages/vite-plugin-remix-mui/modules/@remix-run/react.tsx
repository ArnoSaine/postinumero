import { CacheProvider } from "@emotion/react";
import {
  ResetCacheContext,
  createEmotionCache,
} from "@postinumero/vite-plugin-remix-mui/utils";
import * as RemixReact from "@remix-run/react";
import { useCallback, useState } from "react";

export function Meta() {
  return (
    <>
      <RemixReact.Meta />
      <meta name="emotion-insertion-point" content="emotion-insertion-point" />
    </>
  );
}

export function RemixBrowser() {
  const [cache, setCache] = useState(createEmotionCache);

  const resetCache = useCallback(() => setCache(createEmotionCache()), []);

  return (
    <ResetCacheContext.Provider value={resetCache}>
      <CacheProvider value={cache}>
        <RemixReact.RemixBrowser />
      </CacheProvider>
    </ResetCacheContext.Provider>
  );
}
