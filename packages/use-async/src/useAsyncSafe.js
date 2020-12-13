import { getItem } from './cache.js';
import normalizeArgs from './normalizeArgs.js';
import callAndSuspend from './callAndSuspend.js';
import useUpdaters from './useUpdaters.js';

export default normalizeArgs(function useAsyncSafe(...args) {
  const memoized = getItem(...args);
  useUpdaters(memoized, args);
  if (memoized.value) {
    return memoized.value;
  }
  if (!memoized.suspender) {
    callAndSuspend(args, memoized);
  }
  throw memoized.suspender;
});
