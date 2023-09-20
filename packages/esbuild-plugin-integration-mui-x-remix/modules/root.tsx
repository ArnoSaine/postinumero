import { withEmotionCache } from "@emotion/react";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/material";
import { useContext } from "react";
import { ResetCacheContext } from "../utils";

declare var root: any;

function withMUI(Component: any) {
  return withEmotionCache<any>((props, emotionCache) => {
    const resetCache = useContext(ResetCacheContext);

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line no-underscore-dangle
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      resetCache();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Component {...props} />;
  });
}

export default withMUI(root.default);

export const ErrorBoundary = root.ErrorBoundary && withMUI(root.ErrorBoundary);
