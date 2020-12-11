import recall from './recall.js';
import useAsync from './useAsync.js';
import useAsyncSafe from './useAsyncSafe.js';

export default function create(func, config) {
  return [useAsync, recall, useAsyncSafe].map((fn) => (...args) =>
    fn(func, config, args)
  );
}
