import createStorage from "./createStorage.js";
import type { Key, Replacer, Reviver, Space } from "./index.js";
import parseJson from "./parseJson.js";

export default (storageArea: Storage) => {
  const storage = createStorage(storageArea);

  return {
    ...storage,
    getItem(key: Key, reviver?: Reviver) {
      return parseJson(storage.getItem(key)!, reviver);
    },
    setItem(key: Key, value: any, replacer: Replacer, space: Space) {
      storage.setItem(key, JSON.stringify(value, replacer, space));
    },
  };
};
