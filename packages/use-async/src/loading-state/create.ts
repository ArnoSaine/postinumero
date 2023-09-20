import { constructor } from "../create.js";
import recall from "./recall.js";
import useAsync from "./useAsync.js";
import useAsyncSafe from "./useAsyncSafe.js";

export default constructor<
  ["useAsyncLoadingState", "recall", "useAsyncSafeLoadingState"]
>([useAsync, recall, useAsyncSafe]);
