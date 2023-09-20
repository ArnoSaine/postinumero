import type { Fn, MethodParameters } from "../index.js";
import normalizeArgs from "../normalizeArgs.js";
import useAsyncSafe from "./useAsyncSafe.js";

export default normalizeArgs<"useAsyncLoadingState">(function useAsync<
  Func extends Fn
>(...args: MethodParameters<Func>) {
  const { error, ...other } = useAsyncSafe(...args);
  if (error) {
    throw error;
  }
  return other;
});
