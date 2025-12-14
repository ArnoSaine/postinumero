import {
  type ClientActionFunction,
  type ClientLoaderFunction,
  replace,
} from "react-router";
import config from "../config.ts";
import authenticated from "../loaders/authenticated.ts";
import { getRedirectURI } from "../searchParams.ts";
import { performUserManagerAction } from "../user/manager.ts";
import unflattenRequestData from "../utils/unflattenRequestData.ts";

function login(data: Record<string, any>) {
  if (data.intent === "redirect") {
    if (data.redirect_uri?.startsWith("/")) {
      data.redirect_uri = new URL(
        data.redirect_uri,
        location.toString(),
      ).toString();
    }
  }

  return performUserManagerAction("signin", data);
}

export const clientAction: ClientActionFunction = async (args) => {
  const url = new URL(args.request.url);

  const data = unflattenRequestData(await args.request.formData());

  data.intent ??= "resource-owner-credentials";
  data.redirect_uri ??= getRedirectURI(url.searchParams);

  await login(data);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return null;
};

export const clientLoader: ClientLoaderFunction = async (args) => {
  const url = new URL(args.request.url);
  const data = unflattenRequestData(url.searchParams);

  if (data.intent) {
    await login(data);
  } else {
    await authenticated(args);
  }

  return replace(getRedirectURI(url.searchParams) ?? config.paths.fallback);
};

clientLoader.hydrate = true;

export default function Login() {
  return null;
}
