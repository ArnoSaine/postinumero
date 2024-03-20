import Link from "@mui/material/Link";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <ul>
      <li>
        <Link href="/pets" color="secondary">
          Go to the pets page
        </Link>
      </li>
      <li>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
      </li>
    </ul>
  );
}
