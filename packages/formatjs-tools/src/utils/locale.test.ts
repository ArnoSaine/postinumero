import assert from "node:assert";
import { test } from "node:test";
import { baseLocales, leafLocales } from "./locale.ts";

test("filters leaf locales", () => {
  const locales = ["en", "en-US", "fi-FI", "fr"];

  assert.deepEqual(
    leafLocales(locales),
    ["en-US", "fi-FI", "fr"],
    "leaf locales",
  );
});

test("base locales", () => {
  assert.deepEqual(baseLocales("fi-FI"), ["fi", "fi-FI"], "base locales");
});
