import { LinkProps, createTheme } from "@mui/material";
import type { LinkProps as RouterLinkProps } from "@remix-run/react";
import { Link as RouterLink } from "@remix-run/react";
import { forwardRef } from "react";

const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>(({ href, ...otherProps }, ref) => (
  <RouterLink ref={ref} to={href} {...otherProps} />
));

export default createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
  },
});
