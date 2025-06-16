import type { DataFunctionArgs } from "@postinumero/react-router-formatjs/config";
import { loadIntlContext } from "../middleware.ts";

export const loadIntl = async (args: DataFunctionArgs) =>
  (await loadIntlContext(args)).intl;
