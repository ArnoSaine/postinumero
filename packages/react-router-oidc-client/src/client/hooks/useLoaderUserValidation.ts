import { useEffect } from "react";
import { useRevalidator } from "react-router";
import useUser from "../../user/useUser.ts";
import useUserManagerUser from "./useUserManagerUser.ts";

// This hook checks if the user loaded by the loader (useUser) matches
// the user from the UserManager (useUserManagerUser). If they don't match,
// it triggers a revalidation to ensure the loader fetches the correct user.
export default function useLoaderUserValidation() {
  const { revalidate } = useRevalidator();

  const loaderUserSub = useUser()?.profile.sub;
  const userManagerUserSub = useUserManagerUser()?.profile.sub;

  useEffect(() => {
    if (loaderUserSub !== userManagerUserSub) {
      revalidate();
    }
  }, [loaderUserSub, userManagerUserSub, revalidate]);
}
