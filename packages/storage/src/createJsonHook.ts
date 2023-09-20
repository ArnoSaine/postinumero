import { useMemo } from "react";
import create from "./createHook.js";
import type { Key, Reviver } from "./index.js";
import parseJson from "./parseJson.js";

export default (storageArea: Storage) => {
  const useStorage = create(storageArea);
  return function useJsonStorage(key: Key, reviver?: Reviver) {
    const value = useStorage(key);
    return useMemo(() => parseJson(value!, reviver), [value]);
  };
};
