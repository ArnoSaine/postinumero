import { unauthorized } from "assert-response";
import { camelCase, isEqual } from "lodash-es";
import type { User, UserManager } from "oidc-client-ts";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { useLocation, useRevalidator } from "react-router";
import options from "./options.ts";

export const asyncUserManager = Promise.withResolvers<UserManager>();

export const getUser = async () => {
  const userManager = await asyncUserManager.promise;

  return userManager.getUser();
};

const loginAndLogoutRoutes = Object.values(options.routes);

/**
 * Revalidate loaders on user update. Skips revalidation
 * while logging in or out.
 */
export function useRevalidateUser() {
  const { revalidate } = useRevalidator();
  const user = useUser();
  const prevUserRef = useRef<User | undefined | null>(undefined);
  const { pathname } = useLocation();
  const isLoggingInOrOut = loginAndLogoutRoutes.includes(pathname);

  useEffect(() => {
    if (isLoggingInOrOut) {
      return;
    }
    if (prevUserRef.current === user) {
      return;
    }
    prevUserRef.current = user;

    revalidate();
  }, [user, isLoggingInOrOut]);
}

export const useUser = () => {
  const userRef = useRef<User | undefined | null>(undefined);

  return useSyncExternalStore<User | undefined | null>(
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

      async function handleStorageEvent({ key }: StorageEvent) {
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
    useCallback(() => userRef.current, []),
    () => undefined,
  );
};

export async function actUserManager(
  type: "signin" | "signout",
  intent: string,
  data: any,
) {
  const userManager: UserManager = await asyncUserManager.promise;

  const method = camelCase(`${type}-${intent}`) as
    | "signinPopup"
    | "signinRedirect"
    | "signinResourceOwnerCredentials"
    | "signinSilent"
    | "signoutPopup"
    | "signoutRedirect"
    | "signoutSilent";

  try {
    await userManager[method](data);
  } catch (error) {
    if (error instanceof Error) {
      unauthorized(true, JSON.stringify(error), {
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}
