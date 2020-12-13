export default async function callSafe(fn, ...args) {
  try {
    return [null, await fn.call(this, ...args)];
  } catch (error) {
    return [error];
  }
}
