import useUserMonitor from "../client/hooks/useUserMonitor.ts";
import { useRemoveLogoutIntentSearchParam } from "../logoutIntent.ts";

export default function useOidcProvider() {
  useRemoveLogoutIntentSearchParam();
  useUserMonitor();
}
