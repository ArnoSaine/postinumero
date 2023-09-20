import type { Fn, MethodParameters, UseAsync } from "./index.js";
import normalizeArgs from "./normalizeArgs.js";
import useAsyncSafe from "./useAsyncSafe.js";

export default normalizeArgs<"useAsync">(function useAsync<Func extends Fn>(
  ...args: MethodParameters<Func>
): UseAsync<Func> {
  const [error, data] = useAsyncSafe<Func>(...args);
  if (error) {
    throw error;
  }
  return data as UseAsync<Func>;
});
