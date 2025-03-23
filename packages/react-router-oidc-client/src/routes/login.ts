import {
  actUserManager,
  authenticated,
  getRedirectURI,
  options,
  parseAndUnflatFormData,
} from "@postinumero/react-router-oidc-client";
import {
  ClientActionFunction,
  ClientLoaderFunction,
  replace,
} from "react-router";

export const clientAction: ClientActionFunction = async (args) => {
  const url = new URL(args.request.url);
  let redirectURI = getRedirectURI(url.searchParams);

  const { intent = "resource-owner-credentials", ...data } =
    await parseAndUnflatFormData(args);

  if (intent === "redirect") {
    data.redirect_uri ??= redirectURI;
    if (data.redirect_uri?.startsWith("/")) {
      data.redirect_uri = new URL(
        data.redirect_uri,
        location.toString(),
      ).toString();
    }
  }

  await actUserManager("signin", intent, data);

  return null;
};

export const clientLoader: ClientLoaderFunction = async (args) => {
  await authenticated(args);

  const url = new URL(args.request.url);

  return replace(getRedirectURI(url.searchParams) ?? options.fallbackRoute);
};

export default function Login() {
  return null;
}
