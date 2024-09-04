import callAsyncIterator from "./callAsyncIterator.js";
import type { Fn, Memoized, MethodParameters } from "./index.js";
import callSafe from "./utils/callSafe.js";
import isAsyncIterator from "./utils/isAsyncIterator.js";

function call<Func extends Fn>(
  args: MethodParameters<Func>,
  memoized: Memoized<Func>,
): ReturnType<Func> {
  const [func, , funcArgs] = args;
  if (memoized.cancel) {
    memoized.cancel();
  }
  const result = func(...funcArgs);
  return isAsyncIterator(result) ? callAsyncIterator(result, memoized) : result;
}

async function createSuspenderAndCall<Func extends Fn>(
  args: MethodParameters<Func>,
  memoized: Memoized<Func>,
) {
  memoized.value = await callSafe<Func>(call as Func, args, memoized);
}

export default function callAndSuspend<Func extends Fn>(
  args: MethodParameters<Func>,
  memoized: Memoized<Func>,
) {
  return (memoized.suspender = createSuspenderAndCall(args, memoized));
}
