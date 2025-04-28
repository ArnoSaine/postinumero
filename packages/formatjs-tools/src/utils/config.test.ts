import assert from "node:assert";
import { test } from "node:test";
import { filterBy } from "./config.ts";

test("filters by include and exclude", () => {
  const array = ["a", "b", "c", "d"];
  const filter = {
    include: ["a", "b", "e"],
    exclude: ["c"],
  };
  assert.deepEqual(
    filterBy(array, filter),
    ["a", "b", "d", "e"],
    "filtered array",
  );
});

test("replaced by filter", () => {
  const array = ["a", "b", "c", "d"];
  const filter = ["a", "b", "e"];
  assert.deepEqual(filterBy(array, filter), ["a", "b", "e"], "filtered array");
});
