import { getItem } from './cache.js';
import normalizeArgs from './normalizeArgs.js';
import callAndSuspend from './callAndSuspend.js';
import updateEach from './updateEach.js';

export default normalizeArgs(async function recall(...args) {
  const memoized = getItem(...args);
  if (memoized.updaters.size) {
    await callAndSuspend(args, memoized);
    updateEach(memoized);
  }
});
