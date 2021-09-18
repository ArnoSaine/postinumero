import type { AsyncReturnType, Config, Fn } from '.';
import recall from './recall.js';
import useAsync from './useAsync.js';
import useAsyncSafe from './useAsyncSafe.js';

export function constructor<Method extends Fn>(methods: Method[]) {
  return function create<Func extends Fn>(func: Func, config?: Config) {
    return methods.map(
      (method) =>
        (...args: Parameters<Func>) =>
          method(func, config, args)
    ) as [
      (...args: Parameters<Func>) => AsyncReturnType<Func>,
      (...args: Parameters<Func>) => void,
      (...args: Parameters<Func>) => AsyncReturnType<Func>
    ];
  };
}

const create = constructor([useAsync, recall, useAsyncSafe]);

export default create;
