import { CacheProvider } from "@emotion/react";
import * as RemixReact from "@remix-run/react";
import React, { useCallback, useState } from "react";
import { ResetCacheContext, createEmotionCache } from "../../utils.js";

export * from "@remix-run/react";

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
