import assert from "node:assert";
import { test } from "node:test";
import { match } from "./intl-localematcher.ts";

test("available locale", () => {
  const requestedLocales = ["sv-SE", "en-US"];
  const availableLocales = ["fi-FI", "sv-FI"];
  const defaultLocale = "fi-FI";

  assert.equal(
    match(requestedLocales, availableLocales, defaultLocale),
    "sv-FI",
    "available locale",
  );
});

test("available locale", () => {
  const requestedLocales = ["sv-SE", "en-US"];
  const availableLocales = ["fi-FI", "sv-FI"];
  const defaultLocale = "fi-FI";

  assert.equal(
    match(requestedLocales, availableLocales, defaultLocale),
    "sv-FI",
    "available locale",
  );
});

test("available locale", () => {
  const requestedLocales = ["fi-FI", "en-US"];
  const availableLocales = ["en", "fi-FI", "fr"];
  const defaultLocale = "en";

  assert.equal(
    match(requestedLocales, availableLocales, defaultLocale),
    "fi-FI",
    "available locale",
  );
});

test("available locale", () => {
  const requestedLocales = ["sv-SE", "en-US"];
  const availableLocales = ["en", "fi-FI", "fr"];
  const defaultLocale = "en";

  assert.equal(
    match(requestedLocales, availableLocales, defaultLocale),
    "en",
    "available locale",
  );
});

test("available locale", () => {
  const requestedLocales = ["sv-SE", "en-US"];
  const availableLocales = ["en", "fi-FI", "sv-FI"];
  const defaultLocale = "en";

  assert.equal(
    match(requestedLocales, availableLocales, defaultLocale),
    "sv-FI",
    "available locale",
  );
});

test("available locale", () => {
  const requestedLocales = ["en-US", "sv-SE"];
  const availableLocales = ["en", "fi-FI", "sv-FI"];
  const defaultLocale = "fi-FI";

  assert.equal(
    match(requestedLocales, availableLocales, defaultLocale),
    "en",
    "available locale",
  );
});

test("available locale", () => {
  const requestedLocales = ["en", "sv-SE"];
  const availableLocales = ["en-US", "fi-FI", "sv-FI"];
  const defaultLocale = "fi-FI";

  assert.equal(
    match(requestedLocales, availableLocales, defaultLocale),
    "en-US",
    "available locale",
  );
});

test("available locale", () => {
  const requestedLocales = ["se"];
  const availableLocales = ["en-XA", "en-XB", "fi", "xx-AC", "xx-HA", "xx-LS"];
  const defaultLocale = "en-XA";

  assert.equal(
    match(requestedLocales, availableLocales, defaultLocale),
    "en-XA",
    "available locale",
  );
});

test("available locale", () => {
  const requestedLocales = ["en"];
  const availableLocales = ["en-US"];
  const defaultLocale = "en";

  assert.equal(
    match(requestedLocales, availableLocales, defaultLocale),
    "en-US",
    "available locale",
  );
});

test("available locale", () => {
  const requestedLocales: string[] = [];
  const availableLocales = ["en-US"];
  const defaultLocale = "en";

  assert.equal(
    match(requestedLocales, availableLocales, defaultLocale),
    "en-US",
    "available locale",
  );
});
