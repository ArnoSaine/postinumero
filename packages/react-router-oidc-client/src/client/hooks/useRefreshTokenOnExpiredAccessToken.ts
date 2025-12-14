import { useEffect } from "react";
import { useSubmit } from "react-router";
import useLoginLocation from "../../hooks/useLoginLocation.ts";
import useUserManagerUser from "./useUserManagerUser.ts";

// Token refresh is not started automatically by oidc-client-ts when access token is expired
// https://github.com/authts/oidc-client-ts/issues/2012
export default function useRefreshTokenOnExpiredAccessToken() {
  const loginLocation = useLoginLocation();
  const submit = useSubmit();
  const userManagerUser = useUserManagerUser();
  useEffect(() => {
    if (userManagerUser?.expired) {
      submit({ intent: "silent" }, { action: loginLocation, method: "post" });
    }
  }, [userManagerUser, loginLocation, submit]);
}
