import normalizeArgs from '../normalizeArgs.js';
import useAsyncSafe from './useAsyncSafe.js';

export default normalizeArgs(function useAsync(...args) {
  const { error, ...other } = useAsyncSafe(...args);
  if (error) {
    throw error;
  }
  return other;
});
