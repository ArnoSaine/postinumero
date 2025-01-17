import {
  loadOIDCRoot,
  useRemoveLogoutIntentSearchParam,
  useRevalidateUser,
  withHandleAuthErrorBoundary,
} from "@postinumero/react-router-oidc";
import {
  getKeycloakUser,
  initKeycloak,
} from "@postinumero/react-router-oidc/keycloak";
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
import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import AppBar from "./components/AppBar";
import LoginForm from "./components/LoginForm";

initKeycloak({
  url: "http://localhost:8080",
  realm: "example",
  clientId: "example-client",
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
          <main className="flex-grow flex flex-col bg-gray-100">
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
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
      message = error.status === 404 ? "404" : "Error";
      details =
        error.status === 404
          ? "The requested page could not be found."
          : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
      details = error.message;
      stack = error.stack;
    }
    console.log(error);

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
