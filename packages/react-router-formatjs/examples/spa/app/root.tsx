import {
  loadIntl,
  withLayoutIntlProvider,
} from "@postinumero/react-router-formatjs";
import { useIntl } from "react-intl";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import EnvironmentAndLocaleSelectors from "./EnvironmentAndLocaleSelectors";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const clientAction = async (args: Route.ClientActionArgs) => {
  const intl = await loadIntl(args);
  console.log(
    intl.formatMessage({
      defaultMessage: "Success!",
      description: "Submit success message",
    }),
  );
};

export const Layout = withLayoutIntlProvider(function Layout({ children }) {
  const { locale } = useIntl();

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <EnvironmentAndLocaleSelectors />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
});

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const intl = useIntl();

  let message = intl.formatMessage({
    defaultMessage: "Oops!",
    description: "Error heading: generic",
  });
  let details = intl.formatMessage({
    defaultMessage: "An unexpected error occurred.",
    description: "Error details: generic",
  });
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message =
      error.status === 404
        ? intl.formatMessage({
            defaultMessage: "404",
            description: "Route error heading: 404",
          })
        : intl.formatMessage({
            defaultMessage: "Error",
            description: "Route error heading: generic",
          });
    details =
      error.status === 404
        ? intl.formatMessage({
            defaultMessage: "The requested page could not be found.",
            description: "Route error details: 404",
          })
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
