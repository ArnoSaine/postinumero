import { createAuthRoutes } from "@postinumero/react-router-oidc-client/routes";
import { index, route } from "@react-router/dev/routes";

export default createAuthRoutes([
  index("routes/home.tsx"),
  route("admin", "routes/admin.tsx"),
  route("other", "routes/other.tsx"),
]);
