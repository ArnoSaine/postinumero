async function callSafe(...args) {
  const funcArgs = args.pop();
  const [func] = args;
  try {
    return [null, await func(...funcArgs)];
  } catch (error) {
    return [error];
  }
}

async function call(args, memoized) {
  memoized.value = await callSafe(...args);
}

export default function callAndSuspend(args, memoized) {
  return (memoized.suspender = call(args, memoized));
}
