import useLoaderUserValidation from "../client/hooks/useLoaderUserValidation.ts";
import useSyncStorage from "../client/hooks/useSyncStorage.ts";
import { useRemoveLogoutIntentSearchParam } from "../logoutIntent.ts";

export default function useOidcProvider() {
  useRemoveLogoutIntentSearchParam();
  useSyncStorage();
  useLoaderUserValidation();
}
