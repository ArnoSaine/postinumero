import { valid } from "assert-response";
import { redirect } from "react-router";
import { type EnvironmentStrategy } from "../../options.ts";

export const clientAction: EnvironmentStrategy["clientAction"] = (
  [environment],
  { currentUrl },
) => {
  const isLocal =
    currentUrl.hostname === "localhost" ||
    currentUrl.hostname.endsWith(".localhost");
  if (environment) {
    const parts = environment?.split(".").reverse() ?? [];
    if (isLocal) {
      parts.push("localhost");
    }
    currentUrl.hostname = parts.join(".");
  } else {
    valid(isLocal, "Environment is required");
    currentUrl.hostname = "localhost";
  }
  return redirect(currentUrl.toString());
};

export const clientLoader: EnvironmentStrategy["clientLoader"] = (args) => {
  const url = new URL(args.request.url);
  const hostnameParts = url.hostname.split(".");
  const isLocal = hostnameParts.at(-1) === "localhost";
  return (
    (isLocal ? hostnameParts.slice(0, -1) : hostnameParts)
      .reverse()
      .join(".") || null
  );
};

export const action = clientAction as EnvironmentStrategy["action"];
export const loader = clientLoader as EnvironmentStrategy["loader"];
