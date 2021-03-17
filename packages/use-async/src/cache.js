import { useEffect } from 'react';
import stringify from 'fast-json-stable-stringify';
import memoize from 'memoizee';
import get from '@postinumero/map-get-with-default';

const cache = new WeakMap();

export function getItem(func, config, args) {
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

function removeItem(func, config, args) {
  cache
    .get(func)
    .get(config)
    .delete(...args);
}

export function useItem(...args) {
  const memoized = getItem(...args);
  useEffect(() => {
    const { updaters, cleanupTimeout } = memoized;
    if (cleanupTimeout) {
      clearTimeout(cleanupTimeout);
    }
    return () => {
      memoized.cleanupTimeout = setTimeout(() => {
        if (!updaters.size) {
          memoized.cancel?.();
          removeItem(...args);
        }
      }, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoized]);
  return memoized;
}
