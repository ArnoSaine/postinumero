import type { User } from "oidc-client-ts";
import { serialize } from "../cookie.ts";

export async function setCookie(user: User | null) {
  document.cookie = await serialize(user?.access_token);
}
