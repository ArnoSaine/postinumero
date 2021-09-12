import get from '@postinumero/map-get-with-default';
import stringify from 'fast-json-stable-stringify';
import { fromJSON, toJSON } from 'flatted';
import { useEffect } from 'react';

const GLOBAL = '__useAsyncCache__';
const cacheByFunc = new WeakMap();

const cacheById =
  typeof window !== 'undefined' && window[GLOBAL]
    ? new Map(
        window[GLOBAL].map(([id, cache]) => [
          id,
          new Map(
            [...cache].map(([args, value]) => [
              args,
              {
                updaters: new Set(),
                value: fromJSON(value),
              },
            ])
          ),
        ])
      )
    : new Map();

export const ssrData = (filter) =>
  `(function(){window.${GLOBAL}=${JSON.stringify(
    [...cacheById].map(([id, cache]) => [
      id,

      [...cache].map(([args, { value }]) => [
        args,
        toJSON(filter ? filter(value, { id, args }) : value),
      ]),
    ])
  )}})();`;

export function getItem(func, config, args) {
  const cache = config.id
    ? get(cacheById, config.id, () => new Map())
    : get(cacheByFunc, func, () => new Map());

  return get(cache, stringify(args), () => ({
    updaters: new Set(),
  }));
}

function removeItem(func, config, args) {
  (config.id ? cacheById.get(config.id) : cacheByFunc.get(func)).delete(
    stringify(args)
  );
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
