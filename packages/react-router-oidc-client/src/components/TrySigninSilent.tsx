import { useEffect, type PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import useLocationString from "../utils/react-router/useLocationString.ts";

export default function TrySigninSilent({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const locationString = useLocationString();

  useEffect(() => {
    (async () => {
      // Navigate to the root with a unique query parameter to force the ErrorBoundary reset
      navigate("/?__rr_oidc=" + Date.now(), { replace: true });
      await new Promise((resolve) => setTimeout(resolve));
      navigate(locationString, { replace: true });
    })();
  }, []);

  return children;
}
