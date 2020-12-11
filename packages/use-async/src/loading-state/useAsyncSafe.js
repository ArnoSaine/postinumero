import useForceUpdate from 'use-force-update';
import normalizeArgs from '../normalizeArgs.js';
import useAsyncSafeSuspense from '../useAsyncSafe.js';

export default normalizeArgs(function useAsyncSafe(...args) {
  const forceUpdate = useForceUpdate();
  try {
    const [error, data] = useAsyncSafeSuspense(...args);
    return { isLoading: false, data, error };
  } catch (suspender) {
    suspender.finally(forceUpdate);
    return { isLoading: true };
  }
});
