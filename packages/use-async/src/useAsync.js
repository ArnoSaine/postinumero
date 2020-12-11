import normalizeArgs from './normalizeArgs.js';
import useAsyncSafe from './useAsyncSafe.js';

export default normalizeArgs(function useAsync(...args) {
  const [error, data] = useAsyncSafe(...args);
  if (error) {
    throw error;
  }
  return data;
});
