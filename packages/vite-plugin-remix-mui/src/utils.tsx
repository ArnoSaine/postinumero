import createCache from "@emotion/cache";
import { withEmotionCache } from "@emotion/react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme as muiCreateTheme,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from "@mui/material";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";
import React, {
  ComponentType,
  createContext,
  forwardRef,
  useContext,
} from "react";

export function createEmotionCache() {
  return createCache({ key: "css" });
}

export const ResetCacheContext = createContext(() => {});

export function withMUI<P extends object>(Component: ComponentType<P>) {
  return withEmotionCache((props: P, emotionCache) => {
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

    const theme = muiCreateTheme({
      components: {
        MuiButtonBase: {
          defaultProps: {
            LinkComponent: LinkBehavior,
          },
        },
        MuiLink: {
          defaultProps: {
            component: LinkBehavior,
          },
        },
      },
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    );
  });
}

export const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, "to"> & { href: LinkProps["to"] }
>(({ href, ...otherProps }, ref) => (
  <Link ref={ref} to={href} {...otherProps} />
));

export const themeOptions = {
  components: {
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
  },
};
