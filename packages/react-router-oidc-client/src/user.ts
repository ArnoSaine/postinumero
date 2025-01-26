import { camelCase } from "lodash-es";
import { User, UserManager } from "oidc-client-ts";
import { useEffect, useSyncExternalStore } from "react";
import { useRevalidator } from "react-router";
import { authorized } from "./response.js";

export const asyncUserManager = Promise.withResolvers<UserManager>();

export const getUser = async () => {
  const userManager = await asyncUserManager.promise;

  return userManager.getUser();
};

// Revalidate loaders on user update
export function useRevalidateUser() {
  const { revalidate } = useRevalidator();
  const user = useUser();

  useEffect(() => {
    // FIXME: Clash with login / logout
    setTimeout(revalidate, 1000);
  }, [user]);
}

let user: User | undefined | null = undefined;

export const useUser = () =>
  useSyncExternalStore<User | undefined | null>(
    subscribe,
    getSnapshot,
    () => undefined,
  );

const getSnapshot = () => user;

// function subscribe(callback: () => void) {
//   async function handleUserManagerEvent() {
//     const userManager = await asyncUserManager.promise;
//     user = await userManager.getUser();

//     callback();
//   }

//   async function handleStorageEvent({ key }: StorageEvent) {
//     const userManager = await asyncUserManager.promise;

//     if (key?.startsWith((userManager.settings.stateStore as any)._prefix)) {
//       handleUserManagerEvent();
//     }
//   }

//   window.addEventListener("storage", handleStorageEvent);
//   handleUserManagerEvent();

//   return () => {
//     window.removeEventListener("storage", handleStorageEvent);
//   };
// }

function subscribe(callback: () => void) {
  async function handleUserManagerEvent() {
    const userManager = await asyncUserManager.promise;
    user = await userManager.getUser();

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
}

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
      authorized(false, error.message);
    }
  }
}
