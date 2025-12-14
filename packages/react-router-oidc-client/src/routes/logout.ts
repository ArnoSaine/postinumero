import {
  type ClientActionFunction,
  type ClientLoaderFunction,
  replace,
} from "react-router";
import config from "../config.ts";
import { getRedirectURI } from "../searchParams.ts";
import { performUserManagerAction } from "../user/manager.ts";
import unflattenRequestData from "../utils/unflattenRequestData.ts";

export const clientAction: ClientActionFunction = async (args) => {
  const url = new URL(args.request.url);
  const data = unflattenRequestData(await args.request.formData());
  data.intent ??= "silent";

  if (data.intent === "redirect") {
    data.post_logout_redirect_uri ??= getRedirectURI(url.searchParams);
  }

  if (data.intent === "silent") {
    if (!data.post_logout_redirect_uri) {
      const url = new URL(config.paths.logoutCallback, location.toString());

      data.post_logout_redirect_uri = url.toString();
    }
  }

  await performUserManagerAction("signout", data);

  return null;
};

export const clientLoader: ClientLoaderFunction = async (args) => {
  const url = new URL(args.request.url);

  return replace(getRedirectURI(url.searchParams) ?? config.paths.fallback);
};

export default function Logout() {
  return null;
}
