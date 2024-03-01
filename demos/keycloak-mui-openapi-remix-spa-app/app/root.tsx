import { ThemeProvider } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import SigninForm from "@postinumero/remix-oidc/lib/app/routes/signin/Form";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import theme from "~/theme";

export const clientLoader = () => null;

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
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  );
}

export default function App() {
  return <Outlet />;
}

export const ErrorBoundary = function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 401) {
      return (
        <>
          <SigninForm>
            <TextField required type="text" name="username" />
            <TextField required type="password" name="password" />
            <Button
              type="submit"
              name="method"
              value="signinResourceOwnerCredentials"
            >
              Sign in
            </Button>
          </SigninForm>
          <SigninForm>
            <Button type="submit" name="method" value="signinRedirect">
              Sign in SSO
            </Button>
          </SigninForm>
          <Link href="/">Go to the main page</Link>
        </>
      );
    }

    if (error.status === 403) {
      return (
        <>
          <h2>403</h2>
          <Link href="/">Go to the main page</Link>
        </>
      );
    }
  }

  return <h1>OH snap!</h1>;
};
