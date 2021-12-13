import get from '@postinumero/map-get-with-default';
import stringify from 'fast-json-stable-stringify';
import { fromJSON, toJSON } from 'flatted';
import { useEffect } from 'react';
import type { Config, Fn, Memoized, MethodParameters, Updater } from '.';

const GLOBAL = '__useAsyncCache__';
const cacheByFunc = new WeakMap();

const cache =
  typeof window !== 'undefined' &&
  (window as unknown as { [key: string]: [string, any][] })[GLOBAL];

const cacheById = cache
  ? new Map(
      cache.map(([id, cache]) => [
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

export const nothing = {};

export const ssrData = (
  map: (value: any, { id, args }: { id: string; args: any[] }) => any
) =>
  `(function(){window.${GLOBAL}=${JSON.stringify(
    [...cacheById].map(([id, cache]) => [
      id,

      [...cache]
        .map(
          map
            ? ([args, { value }]) => [args, map(value, { id, args })]
            : ([args, { value }]) => [args, value]
        )
        .filter(([, value]) => value !== nothing)
        .map(([args, value]) => [args, toJSON(value)]),
    ])
  )}})();`;

export function getItem<Func extends Fn>(
  func: Func,
  config: Config,
  args: Parameters<Func>
) {
  const cache = config.id
    ? get(cacheById, config.id, () => new Map())
    : get(cacheByFunc, func, () => new Map());

  return get(
    cache,
    stringify(args),
    () =>
      ({
        updaters: new Set<Updater>(),
      } as Memoized<Func>)
  );
}

function removeItem<Func extends Fn>(
  func: Func,
  config: Config,
  args: Parameters<Func>
) {
  (config.id ? cacheById.get(config.id) : cacheByFunc.get(func)).delete(
    stringify(args)
  );
}

export function useItem<Func extends Fn>(...args: MethodParameters<Func>) {
  const memoized = getItem<Func>(...args);
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
