import { Box, Container, ThemeProvider } from "@mui/material";
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
import moo from "./moo";
import Typography from "@mui/material/Typography";

moo();

export const id = "original root";

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
          <Typography>
            Oops! Looks like you tried to visit a page that you do not have
            access to.
          </Typography>
        );
        break;
      case 404:
        message = (
          <Typography>
            Oops! Looks like you tried to visit a page that does not exist.
          </Typography>
        );
        break;

      default:
        throw new Error(error.data || error.statusText);
    }

    return (
      <>
        <Typography variant="h1">
          {error.status}: {error.statusText}
        </Typography>
        {message}
      </>
    );
  }

  if (error instanceof Error) {
    console.error(error);
    return (
      <>
        <Typography variant="h1">There was an error</Typography>
        <Typography gutterBottom>{error.message}</Typography>
        <Typography>
          Hey, developer, you should replace this with what you want your users
          to see.
        </Typography>
      </>
    );
  }

  return <Typography variant="h1">Unknown Error</Typography>;
}
