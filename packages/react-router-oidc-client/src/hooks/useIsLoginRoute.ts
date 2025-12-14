import { useLocation } from "react-router";
import config from "../config.ts";

export default function useIsLoginRoute() {
  const location = useLocation();

  return location.pathname === config.paths.login;
}
