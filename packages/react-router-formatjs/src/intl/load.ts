import type { DataFunctionArgs } from "../config.ts";
import { loadIntlContext } from "../middleware.ts";

export const loadIntl = async (args: DataFunctionArgs) =>
  (await loadIntlContext(args)).intl;
