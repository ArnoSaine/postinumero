import { type User } from "oidc-client-ts";
import { useEffect, useRef } from "react";
import { useRevalidator } from "react-router";
import { setCookie } from "../cookie.ts";
import useSilentRenew from "./useSilentRenew.ts";

export default function useUserMonitor() {
  useSilentRenew();
  const { revalidate } = useRevalidator();
  const user = useUserManagerUser();
  const prevUserRef = useRef<User | null>(user);

  useEffect(() => {
    if (prevUserRef.current?.profile.sub === user?.profile.sub) {
      return;
    }
    prevUserRef.current = user;

    (async () => {
      await setCookie(user);
      revalidate();
    })();
  }, [user]);
}
