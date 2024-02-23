import { identity } from "lodash-es";
//import * as root from "virtual:remix-config-path:${path.join(config.appDirectory, config.routes.root.file)}";
import * as root from "virtual:~/root";
import { withMUI } from "../../lib/utils.js";

//export * from "virtual:remix-config-path:${path.join(config.appDirectory, config.routes.root.file)}";
export * from "virtual:~/root";

export const Layout = root.Layout && withMUI(root.Layout);

const withMUILayout = root.Layout ? identity<typeof root.Layout> : withMUI;

export default withMUILayout(root.default);

export const ErrorBoundary =
  root.ErrorBoundary && withMUILayout(root.ErrorBoundary);

export const HydrateFallback =
  root.HydrateFallback && withMUILayout(root.HydrateFallback);
