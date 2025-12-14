import { useEffect } from "react";
import { useNavigate } from "react-router";
import useLoginLoaderLocation from "../hooks/useLoginLoaderLocation.ts";

export default function LoginRedirect(data: Record<string, string>) {
  const loginLoaderLocation = useLoginLoaderLocation(data);
  const navigate = useNavigate();

  useEffect(() => {
    navigate(loginLoaderLocation, { replace: true });
  }, [loginLoaderLocation]);

  return null;
}
