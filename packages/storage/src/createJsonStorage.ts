import createStorage from './createStorage';
import parseJson from './parseJson';

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
  } as Storage;
};
