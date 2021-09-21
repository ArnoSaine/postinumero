import get from '@postinumero/map-get-with-default';
import { useEffect, useState } from 'react';
import type { Item, Key } from './index.js';
import getListeners from './listeners.js';

export default (storageArea: Storage) => {
  const storageAreaListeners = getListeners(storageArea);
  return function useStorage(key: Key): Item {
    const [item, setItem] = useState(storageArea.getItem(key));
    useEffect(() => {
      function handleStorageEvent(event: StorageEvent) {
        if (event.key === key && event.storageArea === storageArea) {
          setItem(event.newValue);
        }
      }
      const valueListerers = get(storageAreaListeners, key, () => new Set());
      valueListerers.add(setItem);
      window.addEventListener('storage', handleStorageEvent);
      return () => {
        valueListerers.delete(setItem);
        window.removeEventListener('storage', handleStorageEvent);
      };
    }, [key]);
    return item;
  };
};
