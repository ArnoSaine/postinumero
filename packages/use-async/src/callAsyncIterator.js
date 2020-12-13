import updateEach from './updateEach.js';

export default function callAsyncIterator(asyncIterator, memoized) {
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
