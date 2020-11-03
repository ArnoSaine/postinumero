import { useCallback, useMemo } from 'react';

export default ({ storageArea, useStorageArea }) => (...args) => {
  const [key] = args;
  const value = useStorageArea(...args);
  const setValue = useCallback(
    (...args) => {
      const [value] = args;
      value === undefined
        ? storageArea.removeItem(key)
        : storageArea.setItem(key, ...args);
    },
    [key]
  );
  return useMemo(() => [value, setValue], [value, setValue]);
};
