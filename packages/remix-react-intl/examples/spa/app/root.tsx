import loadLocalePreference from "@postinumero/remix-react-intl/lib/loadLocalePreference";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { FormattedMessage, useIntl } from "react-intl";
import LocaleSelector from "./components/LocaleSelector";

export const clientLoader = async (args: LoaderFunctionArgs) => {
  const localePreference = await loadLocalePreference(args);

  return { localePreference };
};

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
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <h1>
        <FormattedMessage defaultMessage="Welcome to FormatJS (react-intl) + Remix" />
      </h1>
      <LocaleSelector />
      <nav>
        <Link to="/">
          <FormattedMessage defaultMessage="Home" />
        </Link>{" "}
        <Link to="/other">
          <FormattedMessage defaultMessage="Other" />
        </Link>{" "}
        <Link to="/other/nested">
          <FormattedMessage defaultMessage="Other nested route" />
        </Link>
      </nav>
      <Outlet />
    </>
  );
}
