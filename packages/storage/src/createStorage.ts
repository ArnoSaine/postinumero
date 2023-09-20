import type { Item, Key, Listener } from "./index.js";
import getListeners from "./listeners.js";

export default (storageArea: Storage) => {
  const storageAreaListeners = getListeners(storageArea);

  const set = (value: Item) => (listeners: Listener[]) =>
    listeners.forEach((listener) => listener(value!));

  function broadcast(key: Key, value: Item): void {
    const listeners = storageAreaListeners.get(key);
    if (listeners) {
      set(value)(listeners);
    }
  }

  return {
    key(index) {
      return storageArea.key(index);
    },
    getItem(key) {
      return storageArea.getItem(key);
    },
    setItem(key, value) {
      storageArea.setItem(key, value);
      broadcast(key, value);
    },
    removeItem(key) {
      storageArea.removeItem(key);
      broadcast(key, null);
    },
    clear() {
      storageArea.clear();
      storageAreaListeners.forEach(set(null));
    },
  } as Storage;
};
