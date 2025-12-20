import { type LoaderFunctionArgs } from "react-router";
import {
  loadHas,
  loadHasRealmRole,
  loadHasResourceRole,
  loadHasRole,
} from "../is.ts";

import * as base from "../../routes/provider.ssr.ts";

export * from "../../routes/provider.ssr.ts";
export { default } from "../../routes/provider.ssr.ts";

export * from "./provider.ts";

export const loader = async (args: LoaderFunctionArgs) => ({
  ...(await base.loader(args)),
  ...(await loadHasRealmRole(args)),
  ...(await loadHasResourceRole(args)),
  ...(await loadHasRole(args)),
  ...(await loadHas(args)),
});
