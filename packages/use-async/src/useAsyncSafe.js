import { useEffect } from 'react';
import useForceUpdate from 'use-force-update';
import { getItem, removeItem } from './cache.js';
import normalizeArgs from './normalizeArgs.js';
import callAndSuspend from './callAndSuspend.js';

export default normalizeArgs(function useAsyncSafe(...args) {
  const forceUpdate = useForceUpdate();
  const memoized = getItem(...args);
  useEffect(() => {
    const { updaters } = memoized;
    updaters.add(forceUpdate);
    return () => {
      updaters.delete(forceUpdate);
      if (!updaters.size) {
        removeItem(...args);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (memoized.value) {
    return memoized.value;
  }
  if (!memoized.suspender) {
    callAndSuspend(args, memoized);
  }
  throw memoized.suspender;
});
