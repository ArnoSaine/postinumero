import assert from "node:assert";
import { test } from "node:test";
import main from "./main.ts";

test("main", async () => {
  assert.equal(main(), "<%= name %>");
});
