import type { Config, Fn, MethodReturnType } from './index.js';
import recall from './recall.js';
import useAsync from './useAsync.js';
import useAsyncSafe from './useAsyncSafe.js';

export function constructor<MethodTypes extends Array<string>>(methods: Fn[]) {
  return function create<Func extends Fn>(func: Func, config?: Config) {
    return methods.map(
      (method) =>
        (...args: Parameters<Func>) =>
          method(func, config, args)
    ) as [
      (...args: Parameters<Func>) => MethodReturnType<MethodTypes[0], Func>,
      (...args: Parameters<Func>) => MethodReturnType<MethodTypes[1], Func>,
      (...args: Parameters<Func>) => MethodReturnType<MethodTypes[2], Func>
    ];
  };
}

export default constructor<['useAsync', 'recall', 'useAsyncSafe']>([
  useAsync,
  recall,
  useAsyncSafe,
]);
