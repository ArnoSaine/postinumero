import { useEffect } from "react";
import { useRevalidator } from "react-router";
import { userManager } from "../../user/manager.ts";

export default function useSyncStorage() {
  const { revalidate } = useRevalidator();
  useEffect(() => {
    function handleStorageEvent({ key }: StorageEvent) {
      if (key?.startsWith((userManager.settings.stateStore as any)._prefix)) {
        revalidate();
      }
    }

    addEventListener("storage", handleStorageEvent);

    return () => {
      removeEventListener("storage", handleStorageEvent);
    };
  }, [revalidate]);
}
