import { LinearProgress } from "@mui/material";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useIntl } from "react-intl";

export const clientLoader = () => null;

export function Layout({ children }: { children: React.ReactNode }) {
  const intl = useIntl();

  return (
    <html lang={intl.locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default Outlet;

export const HydrateFallback = LinearProgress;
