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

export function removeItem(func, config, args) {
  cache
    .get(func)
    .get(config)
    .delete(...args);
}
