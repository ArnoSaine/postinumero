import { loadIntlContext } from "../middleware.ts";
import type { DataFunctionArgs } from "../options.ts";

export const loadIntl = async (args: DataFunctionArgs) =>
  (await loadIntlContext(args)).intl;
