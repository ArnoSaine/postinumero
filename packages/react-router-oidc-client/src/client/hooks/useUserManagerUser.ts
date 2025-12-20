import { isEqual } from "lodash-es";
import { type User } from "oidc-client-ts";
import { useCallback, useRef, useSyncExternalStore } from "react";
import { userManager } from "../../user/manager.ts";
import useUser from "../../user/useUser.ts";

export default function useUserManagerUser() {
  const userRef = useRef<User | null>(useUser());

  return useSyncExternalStore<User | null>(
    useCallback((callback: () => void) => {
      async function handleUserManagerEvent() {
        const user = await userManager.getUser();

        if (isEqual(userRef.current, user)) {
          return;
        }

        userRef.current = user;

        callback();
      }

      function handleStorageEvent({ key, newValue }: StorageEvent) {
        if (key?.startsWith((userManager.settings.stateStore as any)._prefix)) {
          handleUserManagerEvent();
        }
      }

      userManager.events.addUserSignedIn(handleUserManagerEvent);
      userManager.events.addUserSignedOut(handleUserManagerEvent);
      userManager.events.addUserSessionChanged(handleUserManagerEvent);
      userManager.events.addUserLoaded(handleUserManagerEvent);
      userManager.events.addUserUnloaded(handleUserManagerEvent);
      window.addEventListener("storage", handleStorageEvent);
      handleUserManagerEvent();

      return () => {
        userManager.events.removeUserSignedIn(handleUserManagerEvent);
        userManager.events.removeUserSignedOut(handleUserManagerEvent);
        userManager.events.removeUserSessionChanged(handleUserManagerEvent);
        userManager.events.removeUserLoaded(handleUserManagerEvent);
        userManager.events.removeUserUnloaded(handleUserManagerEvent);
        window.removeEventListener("storage", handleStorageEvent);
      };
    }, []),
    () => userRef.current,
    useCallback(() => userRef.current, []),
  );
}
