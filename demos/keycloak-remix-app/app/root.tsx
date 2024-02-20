import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useMatch,
  useRouteError,
} from "@remix-run/react";
import { useUser } from "~/auth";
import { withApp, withErrorBoundary, withLoader } from "./auth/root";
import SigninForm from "./routes/signin/SigninForm";
import SignoutForm from "./routes/signout/SignoutForm";

export const clientLoader = withLoader();

function Layout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
          <h1>Welcome to Remix</h1>
          <UserInfo />
          {children}
        </div>
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}

function UserInfo() {
  const user = useUser();
  const isSigninRoute = useMatch("/signin");

  return user ? (
    <>
      <div>Signed in: {user.profile.name}</div>
      <SignoutForm />
    </>
  ) : isSigninRoute ? null : (
    <Link
      to={`/signin?${new URLSearchParams({
        redirect_uri: location.href,
      })}`}
    >
      Sign in
    </Link>
  );
}

export default withApp(function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
});

export const ErrorBoundary = withErrorBoundary(function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 401) {
      return (
        <Layout>
          <SigninForm />
          <Link to="/">Go to the main page</Link>
        </Layout>
      );
    }

    if (error.status === 403) {
      return (
        <Layout>
          <h2>403</h2>
          <Link to="/">Go to the main page</Link>
        </Layout>
      );
    }
  }

  return (
    <Layout>
      <h1>OH snap!</h1>
    </Layout>
  );
});
