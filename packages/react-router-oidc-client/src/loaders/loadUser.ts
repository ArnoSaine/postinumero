import type { RouterContextProvider } from "react-router";
import { userContext } from "../user/context.ts";

export default function loadUser({
  context,
}: {
  context: Readonly<RouterContextProvider>;
}) {
  return context.get(userContext);
}
