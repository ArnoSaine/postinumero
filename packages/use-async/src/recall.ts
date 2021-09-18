import { getItem } from './cache.js';
import callAndSuspend from './callAndSuspend.js';
import { Fn, MethodParameters } from './index.js';
import normalizeArgs from './normalizeArgs.js';
import updateEach from './updateEach.js';

export default normalizeArgs(async function recall<Func extends Fn>(
  ...args: MethodParameters<Func>
): Promise<void> {
  const memoized = getItem(...args);
  if (memoized.updaters.size) {
    await callAndSuspend(args, memoized);
    updateEach(memoized);
  }
});
