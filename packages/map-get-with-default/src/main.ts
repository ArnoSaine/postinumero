function getWithDefaultBase<K, V>(map: Map<K, V>, key: K, getDefault: () => V) {
  if (map.has(key)) {
    return map.get(key);
  }
  const defaultValue = getDefault();
  map.set(key, defaultValue);
  return defaultValue;
}

export default function getWithDefault<M, K, V>(
  this: M,
  value: K,
  getDefault: () => V,
): V;
export default function getWithDefault<M, K, V>(
  this: void,
  map: M,
  value: K,
  getDefault: () => V,
): V;

export default function getWithDefault<K, V>(
  this: Map<K, V> | void,
  ...args: any[]
) {
  // Detect method vs function call. In some cases `this` points to the module
  // itself, so we check if `this.default` is not the function itself.
  // `this instanceof Map` may also be used.
  return this && (this as unknown as Module).default !== getWithDefault
    ? getWithDefaultBase(this as Map<K, V>, ...(args as [K, () => V]))
    : getWithDefaultBase(...(args as [Map<K, V>, K, () => V]));
}

interface Module {
  default: typeof getWithDefault;
}
