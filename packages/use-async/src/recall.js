import { getItem } from './cache.js';
import normalizeArgs from './normalizeArgs.js';
import callAndSuspend from './callAndSuspend.js';

export default normalizeArgs(async function recall(...args) {
  const memoized = getItem(...args);
  if (memoized.updaters.size) {
    await callAndSuspend(args, memoized);
    memoized.updaters.forEach((updater) => updater());
  }
});
