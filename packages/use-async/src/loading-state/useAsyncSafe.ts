import useUpdate from 'react-use/lib/useUpdate.js';
import type { Fn, MethodParameters } from '..';
import normalizeArgs from '../normalizeArgs.js';
import useAsyncSafeSuspense from '../useAsyncSafe.js';

export default normalizeArgs(function useAsyncSafe<Func extends Fn>(
  ...args: MethodParameters<Func>
) {
  const update = useUpdate();
  try {
    const [error, data] = useAsyncSafeSuspense(...args);
    return { isLoading: false, data, error };
  } catch (suspender) {
    (suspender as Promise<any>).finally(update);
    return { isLoading: true };
  }
});
