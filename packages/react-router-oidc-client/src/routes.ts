import { RouteConfigEntry, route } from "@react-router/dev/routes";
import options from "./options.js";

const auth: RouteConfigEntry[] = [
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
