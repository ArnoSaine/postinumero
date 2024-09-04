import { metaIntl } from "@postinumero/remix-react-intl";
import {
  Link,
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { FormattedMessage, useIntl } from "react-intl";
import LocaleSelector from "./components/LocaleSelector";

export const meta: MetaFunction = (args) => {
  const intl = metaIntl(args);

  if (intl) {
    return [
      {
        title: intl.formatMessage({
          defaultMessage: "FormatJS (react-intl) example app | Remix",
        }),
      },
    ];
  }
};

export const clientAction = () => null;

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
