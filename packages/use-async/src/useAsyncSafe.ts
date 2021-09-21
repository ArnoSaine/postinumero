import { useItem } from './cache.js';
import callAndSuspend from './callAndSuspend.js';
import type { Fn, MethodParameters, UseAsyncSafe } from './index.js';
import normalizeArgs from './normalizeArgs.js';
import useUpdaters from './useUpdaters.js';

export default normalizeArgs<'useAsyncSafe'>(function useAsyncSafe<
  Func extends Fn
>(...args: MethodParameters<Func>): UseAsyncSafe<Func> {
  const memoized = useItem(...args);
  useUpdaters(memoized);
  if (memoized.value) {
    return memoized.value;
  }
  if (!memoized.suspender) {
    callAndSuspend(args, memoized);
  }
  throw memoized.suspender;
});
