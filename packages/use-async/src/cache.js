import get from '@postinumero/map-get-with-default';
import stringify from 'fast-json-stable-stringify';
import memoize from 'memoizee';
import { createContext, useContext, useEffect } from 'react';

const globalCache = new WeakMap();

export function getItem(func, config, args, cache = globalCache) {
  return get(
    get(cache, func, () => new WeakMap()),
    config,
    () =>
      memoize(
        () => ({
          updaters: new Set(),
        }),
        {
          length: false,
          normalizer: stringify,
          ...config,
        }
      )
  )(...args);
}

function removeItem(func, config, args, cache = globalCache) {
  cache
    .get(func)
    .get(config)
    .delete(...args);
}

export const CacheContext = createContext(globalCache);

export function useItem(...args) {
  const cache = useContext(CacheContext);
  const memoized = getItem(...args, cache);
  useEffect(() => {
    const { updaters, cleanupTimeout } = memoized;
    if (cleanupTimeout) {
      clearTimeout(cleanupTimeout);
    }
    return () => {
      memoized.cleanupTimeout = setTimeout(() => {
        if (!updaters.size) {
          memoized.cancel?.();
          removeItem(...args, cache);
        }
      }, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoized]);
  return memoized;
}
