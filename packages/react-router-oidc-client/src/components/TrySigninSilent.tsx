import { useEffect, type PropsWithChildren } from "react";
import { useRevalidator } from "react-router";
import { trySigninSilent } from "../user/manager.ts";

export default function TrySigninSilent({ children }: PropsWithChildren) {
  const { revalidate } = useRevalidator();

  useEffect(() => {
    (async () => {
      await trySigninSilent();
      revalidate();
    })();
  }, [revalidate]);

  return children;
}
