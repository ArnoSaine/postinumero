import { useUpdate } from "react-use";
import type { Fn, MethodParameters } from "../index.js";
import normalizeArgs from "../normalizeArgs.js";
import useAsyncSafeSuspense from "../useAsyncSafe.js";

export default normalizeArgs<"useAsyncSafeLoadingState">(function useAsyncSafe<
  Func extends Fn,
>(...args: MethodParameters<Func>) {
  const update = useUpdate();
  try {
    const [error, data] = useAsyncSafeSuspense(...args);
    return { isLoading: false, data, error };
  } catch (suspender) {
    (suspender as Promise<void>).finally(update);
    return { isLoading: true };
  }
});
