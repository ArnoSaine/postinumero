export function deepMapKeys(
  obj: unknown,
  fn: (key: string) => string,
): unknown {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepMapKeys(item, fn));
  }

  if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => {
        const newKey = fn(key);
        acc[newKey] = deepMapKeys(value, fn);
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

  return obj;
}
