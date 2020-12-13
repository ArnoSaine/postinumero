import callAsyncIterator from './callAsyncIterator.js';
import callSafe from './utils/callSafe.js';
import isAsyncIterator from './utils/isAsyncIterator.js';

function call(args, memoized) {
  const [func, , funcArgs] = args;
  if (memoized.cancel) {
    memoized.cancel();
  }
  const result = func(...funcArgs);
  return isAsyncIterator(result) ? callAsyncIterator(result, memoized) : result;
}

async function createSuspenderAndCall(args, memoized) {
  memoized.value = await callSafe(call, args, memoized);
}

export default function callAndSuspend(args, memoized) {
  return (memoized.suspender = createSuspenderAndCall(args, memoized));
}
