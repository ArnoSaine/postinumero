import * as root from "@postinumero/vite-plugin-remix-resolve-config-path/preset/root";
import { identity } from "lodash-es";
import { withMUI } from "../../lib/utils.js";

export const Layout = root.Layout && withMUI(root.Layout);

const withMUILayout = root.Layout ? identity<React.ComponentType> : withMUI;

export default withMUILayout(root.default);

export const ErrorBoundary =
  root.ErrorBoundary && withMUILayout(root.ErrorBoundary);

export const HydrateFallback =
  root.HydrateFallback && withMUILayout(root.HydrateFallback);
