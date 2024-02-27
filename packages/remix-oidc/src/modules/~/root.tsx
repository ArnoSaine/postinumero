import * as root from "virtual:remix-resolve-config-path:preset:root";
import { withApp, withErrorBoundary, withLoader } from "../../app/root.js";

export * from "virtual:remix-resolve-config-path:preset:root";

export const clientLoader = withLoader(root.clientLoader);

export default withApp(root.default);

export const ErrorBoundary = withErrorBoundary(root.ErrorBoundary);
