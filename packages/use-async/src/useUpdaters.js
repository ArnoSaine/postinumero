import { useEffect } from 'react';
import useForceUpdate from 'use-force-update';

export default function useUpdaters(memoized, args) {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    const { updaters } = memoized;
    updaters.add(forceUpdate);
    return () => {
      updaters.delete(forceUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoized]);
}
