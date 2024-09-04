import type { Fn, Memoized } from "./index.js";
import updateEach from "./updateEach.js";

export default function callAsyncIterator<Func extends Fn>(
  asyncIterator: AsyncGenerator<any, void, unknown>,
  memoized: Memoized<Func>,
) {
  return new Promise(async (resolve, reject) => {
    memoized.cancel = () => asyncIterator.return();
    let isPending = true;
    try {
      for await (const value of asyncIterator) {
        if (isPending) {
          isPending = false;
          resolve(value);
        } else {
          memoized.value = [null, value];
          updateEach(memoized);
        }
      }
    } catch (error) {
      if (isPending) {
        isPending = false;
        reject(error);
      } else {
        memoized.value = [error];
        updateEach(memoized);
      }
    }
  });
}
