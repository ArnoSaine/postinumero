import { getItem } from "./cache.js";
import callAndSuspend from "./callAndSuspend.js";
import type { Fn, MethodParameters, Recall } from "./index.js";
import normalizeArgs from "./normalizeArgs.js";
import updateEach from "./updateEach.js";

export default normalizeArgs<"recall">(async function recall<Func extends Fn>(
  ...args: MethodParameters<Func>
): Recall {
  const memoized = getItem(...args);
  if (memoized.updaters.size) {
    await callAndSuspend(args, memoized);
    updateEach(memoized);
  }
});
