import { useLoginLoaderLocation } from "@postinumero/react-router-oidc-client";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function LoginRedirect(data: Record<string, string>) {
  const loginLoaderLocation = useLoginLoaderLocation(data);
  const navigate = useNavigate();

  useEffect(() => {
    navigate(loginLoaderLocation, { replace: true });
  }, [loginLoaderLocation]);

  return null;
}
