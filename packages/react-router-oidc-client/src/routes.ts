import { options } from "@postinumero/react-router-oidc-client/options";
import { type RouteConfigEntry, route } from "@react-router/dev/routes";

const auth: RouteConfigEntry[] = [
  route(
    options.routes.loginLoader,
    new URL("routes/login-loader.js", import.meta.url).pathname,
  ),
  route(
    options.routes.login,
    new URL("routes/login.js", import.meta.url).pathname,
  ),
  route(
    options.routes.logout,
    new URL("routes/logout.js", import.meta.url).pathname,
  ),
  route(
    options.routes.logoutCallback,
    new URL("routes/logout-callback.js", import.meta.url).pathname,
  ),
];

export default auth;
