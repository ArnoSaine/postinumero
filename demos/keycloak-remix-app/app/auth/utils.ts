import { useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import { userManager } from ".";

export function useListenChanges() {
  const { revalidate } = useRevalidator();

  useEffect(() => userManager.events.addUserLoaded(revalidate), [revalidate]);
  useEffect(() => userManager.events.addUserUnloaded(revalidate), [revalidate]);
  useEffect(
    () =>
      userManager.events.addSilentRenewError(async () => {
        await userManager.revokeTokens();
        await userManager.removeUser();
        revalidate();
      }),
    [revalidate]
  );

  useEffect(() => {
    async function handleChangeSilentRenew() {
      const start = document.hasFocus() && navigator.onLine;
      if (start) {
        userManager.startSilentRenew();
        revalidate();
      } else {
        userManager.stopSilentRenew();
      }
    }

    const changeSilentRenewEvents = [
      "online",
      "offline",
      "focus",
      "blur",
    ] as const;

    for (const event of changeSilentRenewEvents) {
      addEventListener(event, handleChangeSilentRenew);
    }

    return () => {
      for (const event of changeSilentRenewEvents) {
        removeEventListener(event, handleChangeSilentRenew);
      }
    };
  }, [revalidate]);
}
