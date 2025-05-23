import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { intlMiddleware, loadIntlContext } from "../middleware.ts";
import { saveOptions } from "../options/save.ts";
import routerConfig from "../utils/react-router/config.ts";

// Re-exporting clientAction using * does not work
//export * from "./options.tsx";
export {
  clientAction,
  clientLoader,
  ErrorBoundary,
  shouldRevalidate,
} from "./options.tsx";

export const unstable_middleware = routerConfig.future?.unstable_middleware
  ? [intlMiddleware]
  : undefined;

export const action = async (args: ActionFunctionArgs) =>
  saveOptions(args, "action", false, false);

export const loader = async (args: LoaderFunctionArgs) =>
  (await loadIntlContext(args)).options;
