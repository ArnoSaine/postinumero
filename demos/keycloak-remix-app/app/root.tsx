import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  ClientLoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "@remix-run/react";
import { loadUser, shouldRevalidateUser } from "./auth";

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  return loadUser(args);
};

export const shouldRevalidate: ShouldRevalidateFunction = (args) => {
  return shouldRevalidateUser(args);
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
