import { useLoginLoaderLocation } from "@postinumero/react-router-oidc-client";
import type { ComponentType } from "react";
import { type LinkProps, Link as RouterLink } from "react-router";

export default function LoginLink({
  component: Link = RouterLink,
  data = {},
  ...props
}: Omit<LinkProps, "to"> & {
  component?: ComponentType<LinkProps>;
  data?: Record<string, string>;
}) {
  const loginLoaderLocation = useLoginLoaderLocation(data);

  return <Link to={loginLoaderLocation} replace {...props} />;
}
