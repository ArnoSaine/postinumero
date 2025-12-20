import useRefreshTokenOnExpiredAccessToken from "../client/hooks/useRefreshTokenOnExpiredAccessToken.ts";
import useUserMonitor from "../client/hooks/useUserMonitor.ts";
import { useRemoveLogoutIntentSearchParam } from "../logoutIntent.ts";

export default function useOidcProvider() {
  useRemoveLogoutIntentSearchParam();
  useRefreshTokenOnExpiredAccessToken();
  useUserMonitor();
}
