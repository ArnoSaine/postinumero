import { ClientActionFunctionArgs, ClientLoaderFunction } from "react-router";
import { clientAction, clientLoader as loginClientLoader } from "./login.js";

export const clientLoader: ClientLoaderFunction = async (args) => {
  const url = new URL(args.request.url);

  // Fake form data from searchParams for normal login action
  args.request.formData = () =>
    Promise.resolve(url.searchParams as unknown as FormData);

  await clientAction(args as unknown as ClientActionFunctionArgs);

  return loginClientLoader(args);
};

export default function LoginAction() {
  return null;
}
