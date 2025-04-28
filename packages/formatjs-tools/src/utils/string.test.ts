import assert from "node:assert";
import { test } from "node:test";
import { isLeaf } from "./string.ts";

test("filters leaf paths", () => {
  const paths = [
    "foo",
    "foo/bar",
    "foo/bar/baz",
    "foo/bar/baz/quux",
    "foo/bar/baz/quux/corge",
    "foo/bar/qux",
    "foo/bar/qux/corge",
    "bar",
  ];
  const leafs = paths.filter(isLeaf("/"));

  assert.deepEqual(
    leafs,
    ["foo/bar/baz/quux/corge", "foo/bar/qux/corge", "bar"],
    "leafs",
  );
});
