import { useEffect } from "react";
import { useRevalidator } from "react-router";
import { userManager } from "../../user/manager.ts";

const changeSilentRenewEvents = ["online", "offline", "focus", "blur"] as const;

export default function useSilentRenew() {
  const { revalidate } = useRevalidator();

  useEffect(() => {
    function handleChangeSilentRenew() {
      const start = document.hasFocus() && navigator.onLine;
      if (start) {
        userManager.startSilentRenew();
        revalidate();
      } else {
        userManager.stopSilentRenew();
      }
    }

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
