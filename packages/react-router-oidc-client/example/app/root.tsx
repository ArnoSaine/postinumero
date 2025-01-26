import {
  useRemoveLogoutIntentSearchParam,
  useRevalidateUser,
  withHandleAuthErrorBoundary,
} from "@postinumero/react-router-oidc-client";
import {
  getKeycloakUser,
  initKeycloak,
  loadOIDCRoot,
} from "@postinumero/react-router-oidc-client/keycloak";
import type { PropsWithChildren } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type ClientLoaderFunctionArgs,
} from "react-router";
import type { Route } from "./+types/root.js";
import stylesheet from "./app.css?url";
import AppBar from "./components/AppBar.js";
import LoginForm from "./components/LoginForm.js";

initKeycloak({
  url: "http://main-keycloak.localhost:8080",
  realm: "example",
  client_id: "example-client",
});

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
  // const user = await getUser();
  // user?.access_token;

  const user = await getKeycloakUser();

  return {
    ...(await loadOIDCRoot(args as ClientLoaderFunctionArgs)),
    user,
  };
};

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

  return <Outlet />;
}

export const ErrorBoundary = withHandleAuthErrorBoundary(
  LoginForm,
  function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
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
