import { unflatten } from "flat";
import {
  type ComponentProps,
  type ElementType,
  useEffect,
  useRef,
} from "react";
import {
  type ActionFunctionArgs,
  type ClientActionFunctionArgs,
  createPath,
  useLocation,
} from "react-router";

export type PolymorphicProps<C extends ElementType> = {
  component?: C;
} & ComponentProps<C>;

// https://github.com/authts/react-oidc-context/blob/7a542d3e2710be1d350d66f0940f3b8ea717a388/src/utils.ts#L4
export function hasAuthParams(location: URL) {
  let searchParams = location.searchParams;
  if (
    (searchParams.get("code") || searchParams.get("error")) &&
    searchParams.get("state")
  ) {
    return true;
  }
  searchParams = new URLSearchParams(location.hash.replace("#", "?"));
  if (
    (searchParams.get("code") || searchParams.get("error")) &&
    searchParams.get("state")
  ) {
    return true;
  }
  return false;
}

export async function parseAndUnflatFormData(
  args: ActionFunctionArgs | ClientActionFunctionArgs,
) {
  return unflatten(Object.fromEntries(await args.request.formData())) as Record<
    string,
    any
  >;
}

export const useLocationString = () => createPath(useLocation());

export const useEffectAfterMount: typeof useEffect = (action, deps = []) => {
  const isMountedRef = useRef(false);
  useEffect(() => {
    if (isMountedRef.current) {
      return action();
    }

    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, deps);
};
