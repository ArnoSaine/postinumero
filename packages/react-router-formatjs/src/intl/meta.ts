import { getOptionsFromMatches } from "../options.ts";
import { createIntl } from "./index.ts";

export const metaIntl = (args: any) =>
  createIntl(getOptionsFromMatches(args.matches).intlConfig);
