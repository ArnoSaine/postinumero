import LocaleForm from "@postinumero/remix-react-intl/lib/app/routes/locale/Form";
import options from "@postinumero/remix-react-intl/options";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { FormattedMessage, useIntl } from "react-intl";
import ResetButton from "./components/ResetButton";

export const loader = () => null;

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
          <h1>
            <FormattedMessage defaultMessage="Welcome to FormatJS (react-intl) + Remix" />
          </h1>
          <LocaleForm>
            <ResetButton />
            {options.locales.map((locale) => (
              <button key={locale} name="locale" value={locale}>
                {locale}
              </button>
            ))}
          </LocaleForm>
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
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
