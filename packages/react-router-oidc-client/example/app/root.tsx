import {
  oidc_ssr_clientMiddleware,
  oidc_ssr_middleware,
  useRemoveLogoutIntentSearchParam,
  useRevalidateUser,
  useUserEvent,
  withHandleAuthErrorBoundary,
} from "@postinumero/react-router-oidc-client";
import {
  initKeycloak,
  loadOIDCRoot,
} from "@postinumero/react-router-oidc-client/keycloak";
import { type PropsWithChildren } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root.js";
import stylesheet from "./app.css?url";
import AppBar from "./components/AppBar.js";
import Login from "./components/Login.js";

initKeycloak({
  url: "http://localhost:8080",
  realm: "example",
  client_id: "example-client",
});

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const unstable_middleware = [oidc_ssr_middleware];
export const unstable_clientMiddleware = [oidc_ssr_clientMiddleware];

export const loader = async (args: Route.LoaderArgs) => {
  return {
    ...(await loadOIDCRoot(args)),
  };
};

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
  return {
    ...(await loadOIDCRoot(args)),
  };
};

// For redirect login flow
clientLoader.hydrate = true;

export function Layout({ children }: PropsWithChildren) {
  useRevalidateUser();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-col h-screen">
          <AppBar />
          <main className="flex-grow flex flex-col bg-gray-100 items-center">
            {children}
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useRemoveLogoutIntentSearchParam();

  useUserEvent("unloaded", () => {
    console.log("You have been signed out.");
  });

  return <Outlet />;
}

export const ErrorBoundary = withHandleAuthErrorBoundary(
  Login,
  function ErrorBoundary({ error }) {
    let message: string | undefined;
    let details: string | undefined;
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
      if (error.status === 403) {
        message = "403";
        details = "You don't have permission to access the requested page.";
      }
      if (error.status === 404) {
        message = "404";
        details = "The requested page could not be found.";
      }
      message ??= "Error";
      details ??= error.statusText;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
      details = error.message;
      stack = error.stack;

      console.log(error);
    }

    message ??= "Oops!";
    details ??= "An unexpected error occurred.";

    return (
      <div className="pt-16 p-4 container mx-auto">
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    );
  },
);
