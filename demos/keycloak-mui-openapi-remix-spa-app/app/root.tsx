import { ThemeProvider } from "@mui/material";
import Link from "@mui/material/Link";
import {
  ClientLoaderFunctionArgs,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { loadUser } from "./auth/index";
import {
  useRemoveLogoutIntentSearchParam,
  withRemoveLogoutIntentSearchParam,
} from "./auth/utils";
import Layout from "./components/Layout";
import LoginForm from "./routes/login/LoginForm";
import theme from "./theme";

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  return loadUser(args);
};

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = ({ children, title }: DocumentProps) => {
  return (
    <ThemeProvider theme={theme}>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />
        </head>
        <body>
          <Layout>{children}</Layout>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  );
};

export default function App() {
  useRemoveLogoutIntentSearchParam();

  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export const ErrorBoundary = withRemoveLogoutIntentSearchParam(
  function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
      let message;
      switch (error.status) {
        case 401:
          return (
            <Document title={`${error.status} ${error.statusText}`}>
              <LoginForm />
              <Link href="/">Go to the main page</Link>
            </Document>
          );
          break;
        case 403:
          message = (
            <p>
              {
                "Oops! Looks like you tried to visit a page that you don't have access."
              }
            </p>
          );
          break;
        case 404:
          message = (
            <p>
              Oops! Looks like you tried to visit a page that does not exist.
            </p>
          );
          break;

        default:
          throw new Error(error.data || error.statusText);
      }

      return (
        <Document title={`${error.status} ${error.statusText}`}>
          <h1>
            {error.status}: {error.statusText}
          </h1>
          {message}
          <Link href="/">Go to the main page</Link>
        </Document>
      );
    }

    if (error instanceof Error) {
      console.error(error);
      return (
        <Document title="Error!">
          <div>
            <h1>There was an error</h1>
            <p>{error.message}</p>
            <hr />
            <p>
              Hey, developer, you should replace this with what you want your
              users to see.
            </p>
          </div>
        </Document>
      );
    }

    return <h1>Unknown Error</h1>;
  }
);
