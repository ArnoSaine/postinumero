import { useEffect } from 'react';
import { useUpdate } from 'react-use';

export default function useUpdaters(memoized, args) {
  const update = useUpdate();
  useEffect(() => {
    const { updaters } = memoized;
    updaters.add(update);
    return () => {
      updaters.delete(update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoized]);
}
