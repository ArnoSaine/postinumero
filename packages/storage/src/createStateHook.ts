import { useCallback, useMemo } from 'react';

export default ({
    storageArea,
    useStorageArea,
  }: {
    storageArea: Storage;
    useStorageArea: UseStorage;
  }) =>
  (...args: Parameters<UseStorage>) => {
    const [key] = args;
    const value = useStorageArea(...args);
    const setValue = useCallback(
      (value: Item) => {
        value === undefined
          ? storageArea.removeItem(key)
          : storageArea.setItem(key, value!);
      },
      [key]
    );
    return useMemo(() => [value, setValue], [value, setValue]);
  };
