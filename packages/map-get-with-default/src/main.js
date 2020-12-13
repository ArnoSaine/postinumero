function getWithDefault(map, key, getDefault) {
  return map.has(key)
    ? map.get(key)
    : do {
        const defaultValue = getDefault();
        map.set(key, defaultValue);
        defaultValue;
      };
}

export default function (...args) {
  return this ? getWithDefault(this, ...args) : getWithDefault(...args);
}
