import { loadIntlContext } from "../middleware.ts";
import type { DataFunctionArgs } from "../options.ts";

export const loadOptions = async (args: DataFunctionArgs) =>
  (await loadIntlContext(args)).options;
