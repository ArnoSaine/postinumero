import { withMUI } from "@postinumero/vite-plugin-remix-mui/utils";
import * as root from "@postinumero/vite-plugin-remix-resolve-config-path/resolve/preset/root";
import { identity } from "lodash-es";

export const Layout = root.Layout && withMUI(root.Layout);

const Component = root.default;

const withMUILayout = root.Layout ? identity<React.ComponentType> : withMUI;

export default Component && withMUILayout(Component);

export const ErrorBoundary =
  root.ErrorBoundary && withMUILayout(root.ErrorBoundary);

export const HydrateFallback =
  root.HydrateFallback && withMUILayout(root.HydrateFallback);
