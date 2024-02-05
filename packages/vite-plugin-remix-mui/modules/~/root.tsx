import * as root from "virtual:~/root";
import { withMUI } from "../../lib/utils.js";

export * from "virtual:~/root";

export default withMUI(root.default);

export const ErrorBoundary = root.ErrorBoundary && withMUI(root.ErrorBoundary);
