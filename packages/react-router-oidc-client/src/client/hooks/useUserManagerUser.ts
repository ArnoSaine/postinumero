import { isEqual } from "lodash-es";
import { type User } from "oidc-client-ts";
import { useCallback, useRef, useSyncExternalStore } from "react";
import { asyncUserManager } from "../../user/manager.ts";
import useUser from "../../user/useUser.ts";

export default function useUserManagerUser() {
  const userRef = useRef<User | null>(useUser());

  return useSyncExternalStore<User | null>(
    useCallback((callback: () => void) => {
      async function handleUserManagerEvent() {
        const userManager = await asyncUserManager.promise;
        const user = await userManager.getUser();

        if (isEqual(userRef.current, user)) {
          return;
        }

        userRef.current = user;

        callback();
      }

      async function handleStorageEvent({ key, newValue }: StorageEvent) {
        const userManager = await asyncUserManager.promise;
        if (key?.startsWith((userManager.settings.stateStore as any)._prefix)) {
          handleUserManagerEvent();
        }
      }

      // For async subscribe & unsubscribe
      let state: "subscribe" | "unsubscribe" | "done" = "subscribe";

      (async () => {
        if (state === "subscribe") {
          const userManager = await asyncUserManager.promise;
          userManager.events.addUserSignedIn(handleUserManagerEvent);
          userManager.events.addUserSignedOut(handleUserManagerEvent);
          userManager.events.addUserSessionChanged(handleUserManagerEvent);
          userManager.events.addUserLoaded(handleUserManagerEvent);
          userManager.events.addUserUnloaded(handleUserManagerEvent);
          window.addEventListener("storage", handleStorageEvent);
          handleUserManagerEvent();
          state = "unsubscribe";
        }
      })();

      return async () => {
        if (state === "unsubscribe") {
          const userManager = await asyncUserManager.promise;
          userManager.events.removeUserSignedIn(handleUserManagerEvent);
          userManager.events.removeUserSignedOut(handleUserManagerEvent);
          userManager.events.removeUserSessionChanged(handleUserManagerEvent);
          userManager.events.removeUserLoaded(handleUserManagerEvent);
          userManager.events.removeUserUnloaded(handleUserManagerEvent);
          window.removeEventListener("storage", handleStorageEvent);
        }
        state = "done";
      };
    }, []),
    () => userRef.current,
    useCallback(() => userRef.current, []),
  );
}
