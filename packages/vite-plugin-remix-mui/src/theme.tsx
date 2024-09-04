import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { forwardRef } from "react";

export const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, "to"> & { href: LinkProps["to"] }
>(({ href, ...otherProps }, ref) => (
  <Link ref={ref} to={href} {...otherProps} />
));

export const options = {
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
