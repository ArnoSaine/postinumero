import assert from "node:assert";
import { test } from "node:test";
import { parentDomains, subDomains } from "./domain.ts";

test("sub domains", () => {
  assert.deepEqual(
    subDomains("test.example.com"),
    ["test", "test.example", "test.example.com"],
    "sub domains",
  );
});

test("parent domains", () => {
  assert.deepEqual(
    parentDomains("test.example.com"),
    ["com", "example.com", "test.example.com"],
    "parent domains",
  );
});
