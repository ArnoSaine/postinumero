import { useUpdate } from 'react-use';
import normalizeArgs from '../normalizeArgs.js';
import useAsyncSafeSuspense from '../useAsyncSafe.js';

export default normalizeArgs(function useAsyncSafe(...args) {
  const update = useUpdate();
  try {
    const [error, data] = useAsyncSafeSuspense(...args);
    return { isLoading: false, data, error };
  } catch (suspender) {
    suspender.finally(update);
    return { isLoading: true };
  }
});
