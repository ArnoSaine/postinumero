import { type User } from "oidc-client-ts";
import { useRouteLoaderData } from "react-router";
import config from "../config.ts";

export default function useUser() {
  return (
    useRouteLoaderData<{ user: User | null }>(config.route.id)?.user ?? null
  );
}
