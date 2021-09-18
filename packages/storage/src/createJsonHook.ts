import { useMemo } from 'react';
import create from './createHook';
import parseJson from './parseJson';

export default (storageArea: Storage) => {
  const useStorage = create(storageArea);
  return function useJsonStorage(key: Key, reviver?: Reviver) {
    const value = useStorage(key);
    return useMemo(() => parseJson(value!, reviver), [value]);
  };
};
