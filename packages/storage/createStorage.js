import getListeners from './listeners';

export default (storageArea) => {
  const storageAreaListeners = getListeners(storageArea);

  const set = (value) => (listeners) =>
    listeners.forEach((listener) => listener(value));

  function broadcast(key, value) {
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
  };
};
