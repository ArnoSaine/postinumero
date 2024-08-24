import parseJsonValues from "@postinumero/config/utils/parseJsonValues";
import { strict as assert } from "node:assert";
import { suite, test } from "node:test";

const tests = [
  {
    name: "boolean",
    value: "true",
    expected: true,
  },
  {
    name: "number",
    value: "123",
    expected: 123,
  },
  {
    name: "string",
    value: '"a"',
    expected: "a",
  },
  {
    name: "non JSON boolean string",
    value: '"true"',
    expected: "true",
  },
  {
    name: "non JSON number number",
    value: '"123"',
    expected: "123",
  },
  {
    name: "non JSON string",
    value: "a",
    expected: "a",
  },
];

suite("parseJsonValues", () => {
  test("undefined", () => {
    assert.deepEqual(parseJsonValues(), {});
  });

  test("empty object", () => {
    assert.deepEqual(parseJsonValues({}), {});
  });

  tests.forEach(({ name, value, expected }) => {
    test(name, () => {
      assert.deepEqual(parseJsonValues({ a: value }), { a: expected });
    });
  });
});
