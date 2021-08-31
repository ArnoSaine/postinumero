import { useEffect } from 'react';
import useUpdate from 'react-use/lib/useUpdate.js';

const _useUpdate = useUpdate?.__esModule ? useUpdate['default'] : useUpdate;

export default function useUpdaters(memoized, args) {
  const update = _useUpdate();
  useEffect(() => {
    const { updaters } = memoized;
    updaters.add(update);
    return () => {
      updaters.delete(update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoized]);
}
