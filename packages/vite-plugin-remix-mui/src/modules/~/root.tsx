import { identity } from "lodash-es";
import * as root from "virtual:remix-resolve-config-path:preset:root";
import { withMUI } from "../../utils.js";

export * from "virtual:remix-resolve-config-path:preset:root";

export const Layout = root.Layout && withMUI(root.Layout);

const withMUILayout = root.Layout ? identity<typeof root.Layout> : withMUI;

export default withMUILayout(root.default);

export const ErrorBoundary =
  root.ErrorBoundary && withMUILayout(root.ErrorBoundary);

export const HydrateFallback =
  root.HydrateFallback && withMUILayout(root.HydrateFallback);
