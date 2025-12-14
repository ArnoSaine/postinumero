import { camelCase } from "lodash-es";
import type { UserManager } from "oidc-client-ts";
import { useEffect } from "react";
import { asyncUserManager } from "../../user/manager.ts";

export type EventType =
  | "signedIn"
  | "signedOut"
  | "sessionChanged"
  | "loaded"
  | "unloaded";

const getEventName = (eventType: EventType) => (updateType: "add" | "remove") =>
  camelCase(`${updateType}-user-${eventType}`) as keyof UserManager["events"];

export default function useUserEvent(
  type: EventType,
  callback: (...args: any[]) => any,
  deps?: React.DependencyList,
) {
  useEffect(() => {
    const eventName = getEventName(type);
    let shouldAddListener = true;
    (async () => {
      const userManager = await asyncUserManager.promise;
      if (!shouldAddListener) {
        return;
      }
      (userManager.events[eventName("add")] as any)(callback);
    })();
    return () => {
      (async () => {
        shouldAddListener = false;
        const userManager = await asyncUserManager.promise;
        (userManager.events[eventName("remove")] as any)(callback);
      })();
    };
  }, deps);
}
