import reflect from "@postinumero/config/utils/reflect";
import { strict as assert } from "node:assert";
import { suite, test } from "node:test";

class MyClass {
  constructor() {
    this.x = 123;
  }
}

const tests = [
  {
    name: "array",
    constructor: Array,
    value: [1, 2, 3],
  },
  {
    name: "array deepEqual",
    constructor: Array,
    value: [1, 2, 3],
    equal: "deepEqual",
  },
  {
    constructor: BigInt,
    value: 9007199254740991n,
  },
  {
    constructor: Boolean,
    value: true,
  },
  {
    name: "date",
    constructor: Date,
    value: new Date(1000000000000),
    toActual: (value) => new Date(value),
    equal: "deepEqual",
  },
  {
    constructor: Function,
    value: () => "hello",
    expectTypeOf: "function",
  },
  {
    name: "map",
    constructor: Map,
    value: new Map([["a", 1]]),
  },
  {
    name: "map deepEqual",
    constructor: Map,
    value: new Map([["a", 1]]),
    equal: "deepEqual",
  },
  {
    constructor: Number,
    value: 20,
  },
  {
    constructor: Object,
    value: { a: 1 },
  },
  {
    name: "object deepEqual",
    constructor: Object,
    value: { a: 1 },
    equal: "deepEqual",
  },
  {
    constructor: String,
    value: "a",
  },
  {
    name: "url",
    constructor: URL,
    value: new URL("http://example.com"),
  },
  {
    constructor: Symbol,
    value: Symbol("foo"),
  },
  {
    name: "array index",
    constructor: Array,
    value: [1, 2, 3],
    toActual: (value) => value[1],
    expect: 2,
  },
  {
    name: "boolean from double logical NOT (!!)",
    constructor: Boolean,
    value: true,
    toActual: (value) => !!value,
    accessBeforeSet: "doesNotThrow",
  },
  {
    name: "function call",
    constructor: Function,
    value: (number) => number + 2,
    toActual: (value) => value(20),
    expect: 22,
    expectTypeOf: "function",
  },
  {
    name: "number from unary plus operator (+)",
    constructor: Number,
    value: 20,
    toActual: (value) => +value,
  },
  {
    name: "object property",
    constructor: Object,
    value: { a: 1 },
    toActual: (value) => value.a,
    expect: 1,
  },
  {
    name: "string expression",
    constructor: String,
    value: "a",
    toActual: (value) => `${value}`,
  },
  {
    name: "myClass",
    constructor: MyClass,
    value: new MyClass(),
  },
].map((test) => ({
  toActual: (value) => value.valueOf(),
  equal: "equal",
  expect: test.value,
  expectTypeOf: "object",
  accessBeforeSet: "throws",
  name: typeof test.value,
  ...test,
}));

suite("reflect", () => {
  suite("unable to access before set", () => {
    tests.forEach(({ name, constructor, toActual, accessBeforeSet }) => {
      test(name, () => {
        const [ref] = reflect(constructor);

        assert[accessBeforeSet](() => {
          toActual(ref);
        });
      });
    });
  });

  suite("able to access after set", () => {
    tests.forEach(({ name, constructor, value, toActual }) => {
      test(name, () => {
        const [ref, setRef] = reflect(constructor);
        setRef(value);

        assert.doesNotThrow(() => {
          toActual(ref);
        });
      });
    });
  });

  suite("valueOf", () => {
    tests.forEach(({ name, constructor, equal, value, toActual, expect }) => {
      test(name, () => {
        const [ref, setRef] = reflect(constructor);
        setRef(value);

        assert[equal](toActual(ref), expect);
      });
    });
  });

  suite("typeof", () => {
    tests.forEach(({ name, constructor, expectTypeOf }) => {
      test(name, () => {
        const [ref] = reflect(constructor);

        assert.equal(typeof ref, expectTypeOf);
      });
    });
  });
});
