import { useCallback, useMemo } from "react";

export default ({
    storageArea,
    useStorageArea,
  }: {
    storageArea: any;
    useStorageArea: any;
  }) =>
  (...args: any[]) => {
    const [key] = args;
    const value = useStorageArea(...args);
    const setValue = useCallback(
      (value) => {
        value === undefined
          ? storageArea.removeItem(key)
          : storageArea.setItem(key, value);
      },
      [key]
    );
    return useMemo<[typeof value, typeof setValue]>(
      () => [value, setValue],
      [value, setValue]
    );
  };
