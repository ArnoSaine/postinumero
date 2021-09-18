import type { Fn, MethodParameters } from '.';
import { useItem } from './cache.js';
import callAndSuspend from './callAndSuspend.js';
import normalizeArgs from './normalizeArgs.js';
import useUpdaters from './useUpdaters.js';

export default normalizeArgs(function useAsyncSafe<Func extends Fn>(
  ...args: MethodParameters<Func>
) {
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
