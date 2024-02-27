import { useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import { userManager } from "./index.js";

type UseEffectParams = Parameters<typeof useEffect>;

function useAsyncEffect(
  effect: () => Promise<(() => void) | void>,
  dependencies: UseEffectParams[1]
) {
  return useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | void;
    (async () => {
      cleanup = await effect();
      if (cancelled) {
        cleanup?.();
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, dependencies);
}

export function useListenChanges() {
  const { revalidate } = useRevalidator();

  useAsyncEffect(
    async () => (await userManager)?.events.addUserLoaded(revalidate),
    [revalidate]
  );
  useAsyncEffect(
    async () => (await userManager)?.events.addUserUnloaded(revalidate),
    [revalidate]
  );
  useAsyncEffect(
    async () =>
      (await userManager)?.events.addSilentRenewError(async () => {
        await (await userManager)?.revokeTokens();
        await (await userManager)?.removeUser();
        revalidate();
      }),
    [revalidate]
  );

  useEffect(() => {
    async function handleChangeSilentRenew() {
      const start = document.hasFocus() && navigator.onLine;
      if (start) {
        (await userManager)?.startSilentRenew();
        revalidate();
      } else {
        (await userManager)?.stopSilentRenew();
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
