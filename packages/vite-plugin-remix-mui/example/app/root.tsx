import { ThemeProvider } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import Copyright from "~/components/Copyright";
import ProTip from "~/components/ProTip";
import theme from "~/theme";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <Meta />
          <Links />
        </head>
        <body>
          <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
              {children}
              <ProTip />
              <Copyright />
            </Box>
          </Container>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  );
}

export function HydrateFallback() {
  return null;
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    let message;
    switch (error.status) {
      case 401:
        message = (
          <p>
            Oops! Looks like you tried to visit a page that you do not have
            access to.
          </p>
        );
        break;
      case 404:
        message = (
          <p>Oops! Looks like you tried to visit a page that does not exist.</p>
        );
        break;

      default:
        throw new Error(error.data || error.statusText);
    }

    return (
      <>
        <h1>
          {error.status}: {error.statusText}
        </h1>
        {message}
      </>
    );
  }

  if (error instanceof Error) {
    console.error(error);
    return (
      <>
        <h1>There was an error</h1>
        <p>{error.message}</p>
        <hr />
        <p>
          Hey, developer, you should replace this with what you want your users
          to see.
        </p>
      </>
    );
  }

  return <h1>Unknown Error</h1>;
}
