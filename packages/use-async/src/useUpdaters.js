import { useEffect } from 'react';
import useForceUpdate from 'use-force-update';
import { removeItem } from './cache.js';

export default function useUpdaters(memoized, args) {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    const { cancel, updaters } = memoized;
    updaters.add(forceUpdate);
    return () => {
      updaters.delete(forceUpdate);
      if (!updaters.size) {
        if (cancel) {
          cancel();
        }
        removeItem(...args);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoized]);
}
