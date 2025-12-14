import { Outlet } from "react-router";
import useOidcProvider from "../hooks/useOidcProvider.tsx";

export default function Provider() {
  useOidcProvider();

  return <Outlet />;
}
