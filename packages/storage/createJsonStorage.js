import createStorage from './createStorage';
import parseJson from './parseJson';

export default (storageArea) => {
  const storage = createStorage(storageArea);

  return {
    ...storage,
    getItem(key, reviver) {
      return parseJson(storage.getItem(key), reviver);
    },
    setItem(key, value, replacer, space) {
      storage.setItem(key, JSON.stringify(value, replacer, space));
    },
  };
};
