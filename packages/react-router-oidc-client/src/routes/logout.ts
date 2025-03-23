import {
  actUserManager,
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

  const { intent = "silent", ...data } = await parseAndUnflatFormData(args);

  if (intent === "redirect") {
    data.post_logout_redirect_uri ??= getRedirectURI(url.searchParams);
  }

  if (intent === "silent") {
    if (!data.post_logout_redirect_uri) {
      const url = new URL(options.routes.logoutCallback, location.toString());

      data.post_logout_redirect_uri = url.toString();
    }
  }

  await actUserManager("signout", intent, data);

  return null;
};

export const clientLoader: ClientLoaderFunction = async (args) => {
  const url = new URL(args.request.url);

  return replace(getRedirectURI(url.searchParams) ?? options.fallbackRoute);
};

export default function Logout() {
  return null;
}
