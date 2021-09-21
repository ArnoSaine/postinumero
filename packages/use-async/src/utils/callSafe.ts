import type { AsyncReturnType, Fn } from '../index.js';

export default async function callSafe<Func extends Fn>(
  this: any,
  fn: Func,
  ...args: any
): Promise<[null | any, AsyncReturnType<Func>?]> {
  try {
    return [null, await fn.call(this, ...args)];
  } catch (error) {
    return [error];
  }
}
