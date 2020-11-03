import { useState, useEffect } from 'react';
import get from '@postinumero/map-get-with-default';
import getListeners from './listeners';

export default (storageArea) => {
  const storageAreaListeners = getListeners(storageArea);
  return function useStorage(key) {
    const [item, setItem] = useState(storageArea.getItem(key));
    useEffect(() => {
      function handleStorageEvent(event) {
        if (event.key === key && event.storageArea === storageArea) {
          setItem(event.newValue);
        }
      }
      const valueListerers = get.call(
        storageAreaListeners,
        key,
        () => new Set()
      );
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
