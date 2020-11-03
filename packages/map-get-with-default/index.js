export default function getWithDefault(key, getDefault) {
  return this.has(key)
    ? this.get(key)
    : (() => {
        const defaultValue = getDefault();
        this.set(key, defaultValue);
        return defaultValue;
      })();
}
