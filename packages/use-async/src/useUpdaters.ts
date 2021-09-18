import { useEffect } from 'react';
import useUpdate from 'react-use/lib/useUpdate';
import type { Fn, Memoized } from '.';

export default function useUpdaters<Func extends Fn>(memoized: Memoized<Func>) {
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
