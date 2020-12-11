import recall from './recall.js';
import useAsync from './useAsync.js';
import useAsyncSafe from './useAsyncSafe.js';

export function constructor(fns) {
  return function create(func, config) {
    return fns.map((fn) => (...args) => fn(func, config, args));
  };
}

export default constructor([useAsync, recall, useAsyncSafe]);
