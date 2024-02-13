import {
  ClientLoaderFunctionArgs,
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
import { loadUser, useUser } from "~/auth";
import {
  useRemoveLogoutIntentSearchParam,
  withRemoveLogoutIntentSearchParam,
} from "./auth/utils";
import LoginForm from "./routes/login/LoginForm";
import LogoutForm from "./routes/logout/LogoutForm";

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  return loadUser(args);
};

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
  const login = useMatch("/login");

  return user ? (
    <>
      <div>Logged in: {user.profile.name}</div>
      <LogoutForm />
    </>
  ) : login ? null : (
    <Link
      to={`/login?${new URLSearchParams({
        redirect_uri: location.href,
      })}`}
    >
      Login
    </Link>
  );
}

export default function App() {
  useRemoveLogoutIntentSearchParam();

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export const ErrorBoundary = withRemoveLogoutIntentSearchParam(
  function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
      if (error.status === 401) {
        return (
          <Layout>
            <LoginForm />
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
  }
);
