import auth from "@postinumero/react-router-oidc-client/routes";
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("admin", "routes/admin.tsx"),
  route("other", "routes/other.tsx"),
  ...auth,
] satisfies RouteConfig;
