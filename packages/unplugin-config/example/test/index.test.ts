import { describe, expect, test } from "vitest";
import config from "~config";
import awaited from "~config/awaited";
import promise from "~config/promise";
import proxy, { ready } from "~config/proxy";
import raw from "~config/raw";
import ref from "~config/ref";

describe("config", () => {
  test("values", () => {
    expect(config.string).toBe("runtime value");
    expect(config.boolean).toBe(true);
    expect(config.number).toBe(456);
    expect(config.some.nested.value).toBe("some nested environment value");
    expect(config.some.other).toBe("other default value");
    expect(config.more).toStrictEqual([456, "bar", 789]);
  });

  test("awaited", () => {
    expect(awaited).toBe(config);
  });

  test("promise", async () => {
    expect(promise).toBeInstanceOf(Promise);
    expect(await promise).toBe(config);
  });

  test("proxy", async () => {
    expect(ready).toBeInstanceOf(Promise);
    await ready;
    expect(proxy.string).toBe("runtime value");
  });

  test("raw", () => {
    expect(raw).toBeInstanceOf(Array);
    expect(raw.length).toBe(3);
  });

  test("ref", async () => {
    expect(ref.ready).toBeInstanceOf(Promise);
    await ref.ready;
    expect(ref.current).toBe(config);
  });
});
