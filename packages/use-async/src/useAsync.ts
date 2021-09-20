import { AsyncReturnType, Fn, MethodParameters } from './index.js';
import normalizeArgs from './normalizeArgs.js';
import useAsyncSafe from './useAsyncSafe.js';

export default normalizeArgs(function useAsync<Func extends Fn>(
  ...args: MethodParameters<Func>
): AsyncReturnType<Func> {
  const [error, data] = useAsyncSafe<Func>(...args);
  if (error) {
    throw error;
  }
  return data as AsyncReturnType<Func>;
});
