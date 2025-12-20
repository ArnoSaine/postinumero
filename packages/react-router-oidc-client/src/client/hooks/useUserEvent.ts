import { camelCase } from "lodash-es";
import type { UserManager } from "oidc-client-ts";
import { useEffect } from "react";
import { userManager } from "../../user/manager.ts";

export type EventType =
  | "loaded"
  | "sessionChanged"
  | "signedIn"
  | "signedOut"
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
    (userManager.events[eventName("add")] as any)(callback);
    return () => {
      (userManager.events[eventName("remove")] as any)(callback);
    };
  }, deps);
}
