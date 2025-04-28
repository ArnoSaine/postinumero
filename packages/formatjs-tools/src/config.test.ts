import assert from "node:assert";
import { test } from "node:test";
import { inheritedEnvironments } from "./config.ts";

test("inherited environments", () => {
  assert.deepEqual(
    inheritedEnvironments("com.example"),
    ["example", "com", "com.example"],
    "inherited environments",
  );
});

test("inherited environments", () => {
  assert.deepEqual(
    inheritedEnvironments("com.example.test"),
    ["test", "example.test", "com", "com.example", "com.example.test"],
    "inherited environments",
  );
});
