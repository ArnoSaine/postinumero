import type { DataFunctionArgs } from "@postinumero/react-router-formatjs/config";
import { loadIntlContext } from "../middleware.ts";

export const loadOptions = async (args: DataFunctionArgs) =>
  (await loadIntlContext(args)).options;
