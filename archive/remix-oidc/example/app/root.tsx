import { useUser } from "../../lib/index.js";
import SigninForm from "../../lib/app/routes/signin/Form.js";
import SignoutForm from "../../lib/app/routes/signout/Form.js";
import config from "../../lib/config.js";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useMatch,
  useRouteError,
} from "@remix-run/react";

export const clientLoader = () => null;

export function Layout({ children }: { children: React.ReactNode }) {
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
          <h1>Welcome to Keycloak + Remix</h1>
          <UserInfo />
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return null;
}

function UserInfo() {
  const user = useUser();
  const isSigninRoute = useMatch(config.routes.signin);
  const location = useLocation();

  return user ? (
    <>
      <div>Signed in: {user.profile.name}</div>
      <SignoutForm>
        <button>Sign out</button>
      </SignoutForm>
    </>
  ) : isSigninRoute ? null : (
    <Link
      to={`${config.routes.signin}?${new URLSearchParams({
        redirect_uri: `${location.pathname}${location.search}${location.hash}`,
      })}`}
    >
      Sign in
    </Link>
  );
}

export default (function App() {
  return <Outlet />;
});

export const ErrorBoundary = function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 401) {
      return (
        <>
          <SigninForm>
            <input required type="text" name="username" />
            <input required type="password" name="password" />
            <button name="method" value="signinResourceOwnerCredentials">
              Sign in
            </button>
          </SigninForm>
          <SigninForm>
            <button name="method" value="signinRedirect">
              Sign in SSO
            </button>
          </SigninForm>
          <Link to="/">Go to the main page</Link>
        </>
      );
    }

    if (error.status === 403) {
      return (
        <>
          <h2>403</h2>
          <Link to="/">Go to the main page</Link>
        </>
      );
    }
  }

  return <h1>OH snap!</h1>;
};
