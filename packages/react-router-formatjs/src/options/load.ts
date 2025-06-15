import type { DataFunctionArgs } from "../config.ts";
import { loadIntlContext } from "../middleware.ts";

export const loadOptions = async (args: DataFunctionArgs) =>
  (await loadIntlContext(args)).options;
