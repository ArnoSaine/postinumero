import * as root from "@postinumero/vite-plugin-remix-resolve-config-path/resolve/preset/root";
import { withApp, withErrorBoundary, withLoader } from "../../lib/app/root.js";

export const clientLoader = withLoader(root.clientLoader);

export default withApp(root.default);

export const ErrorBoundary = withErrorBoundary(root.ErrorBoundary);
