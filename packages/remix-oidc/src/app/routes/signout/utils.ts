import {
  isRouteErrorResponse,
  redirect,
  useLocation,
  useNavigate,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { useEffect } from "react";
import userConfig from "../../../config.js";

export const signoutIntentSearchParam = { name: "intent", value: "signout" };

const isSigningOut = (searchParams: URLSearchParams) =>
  searchParams.get(signoutIntentSearchParam.name) ===
  signoutIntentSearchParam.value;

export function useDeleteSignoutIntentSearchParam() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (isSigningOut(searchParams)) {
      searchParams.delete(signoutIntentSearchParam.name);
      setSearchParams(searchParams, {
        replace: true,
        preventScrollReset: true,
      });
    }
  }, [searchParams, setSearchParams]);
}

export function useHandleSignout() {
  const error = useRouteError();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isRouteErrorResponse(error)) {
      if (error.status === 401) {
        if (isSigningOut(searchParams)) {
          navigate(
            { ...location, pathname: userConfig.routes.home },
            { replace: true, preventScrollReset: true },
          );
        }
      }
    }
  });
}

export const signoutRedirect = (redirect_uri: string) => {
  const url = new URL(redirect_uri);
  url.searchParams.set(
    signoutIntentSearchParam.name,
    signoutIntentSearchParam.value,
  );

  return redirect(url.toString());
};
