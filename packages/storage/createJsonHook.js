import { useMemo } from 'react';
import create from './createHook';
import parseJson from './parseJson';

export default (storageArea) => {
  const useStorage = create(storageArea);
  return function useJsonStorage(key, reviver) {
    const value = useStorage(key);
    return useMemo(() => parseJson(value, reviver), [value]);
  };
};
