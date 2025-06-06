import useUpdateLib from "react-use/lib/useUpdate.js";
import type { Fn, MethodParameters } from "../index.js";
import normalizeArgs from "../normalizeArgs.js";
import useAsyncSafeSuspense from "../useAsyncSafe.js";

const useUpdate = useUpdateLib.default ?? useUpdateLib;

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
