import { getOptionsFromMatches } from "../options/getOptionsFromMatches.ts";
import { createIntl } from "./index.ts";

export const metaIntl = (args: any) =>
  createIntl(getOptionsFromMatches(args.matches).intlConfig);
