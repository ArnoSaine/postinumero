import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import * as proxy1 from "./proxy-1";
import * as someLibrary from "./some-library";

console.log(proxy1 === someLibrary, "p1");
console.log((someLibrary as unknown as { p2: string }).p2 === "p2", "p2 a");
console.log((proxy1 as unknown as { p2: string }).p2 === "p2", "p2 b");

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
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
          <h1>Layout</h1>
          {children}
          <someLibrary.Component />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <h2>Root</h2>
      <Outlet />
    </>
  );
}
