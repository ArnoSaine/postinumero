import createCache from "@emotion/cache";
import { withEmotionCache } from "@emotion/react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from "@mui/material";
import { ComponentType, createContext, useContext } from "react";

export function createEmotionCache() {
  return createCache({ key: "css" });
}

export const ResetCacheContext = createContext(() => {});

export function withMUI<Props extends object>(Component: ComponentType<Props>) {
  const theme = createTheme();

  return withEmotionCache((props: Props, emotionCache) => {
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

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    );
  });
}
