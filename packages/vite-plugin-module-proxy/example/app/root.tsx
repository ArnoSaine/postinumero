import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import test, { Component, name, other } from "./some-library";

const value = test();

console.log(value === "original123", value);

console.log(
  (name as string) ===
    "Wrapped (SOME-LIBRARY)Wrapped (SOME-LIBRARY)Wrapped (SOME-LIBRARY)Wrapped (SOME-LIBRARY)",
  name,
);

console.log(other === "other value", other);

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
        {children}
        <Component />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
