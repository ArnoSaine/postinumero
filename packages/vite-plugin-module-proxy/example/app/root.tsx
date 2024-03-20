import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import * as someLibrary from "./some-library";
import * as proxy1 from "./proxy-1";

console.log(proxy1 === someLibrary, "p1");

const value = someLibrary.default();
console.log(value === "original321", value);

console.log(
  (someLibrary.name as string) ===
    "Wrapped (SOME-LIBRARY)Wrapped (SOME-LIBRARY)Wrapped (SOME-LIBRARY)Wrapped (SOME-LIBRARY)",
  someLibrary.name,
);

console.log(someLibrary.other === "other value", someLibrary.other);

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
        <someLibrary.Component />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
