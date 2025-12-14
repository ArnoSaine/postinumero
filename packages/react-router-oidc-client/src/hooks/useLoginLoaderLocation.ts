import { createPath, parsePath } from "react-router";
import config from "../config.ts";
import useLoginLocation from "./useLoginLocation.ts";

export default function useLoginLoaderLocation(data: Record<string, string>) {
  const location = parsePath(useLoginLocation(config.paths.login));

  const searchParams = new URLSearchParams(location.search);

  // Add data params
  for (const [key, value] of Object.entries(data)) {
    searchParams.append(key, value);
  }

  location.search = searchParams.toString();

  return createPath(location);
}
