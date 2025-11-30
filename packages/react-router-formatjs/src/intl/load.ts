import type { DataFunctionArgs } from "@postinumero/react-router-formatjs/config";
import { loadIntlContext } from "@postinumero/react-router-formatjs/middleware";

export const loadIntl = async (args: DataFunctionArgs) =>
  (await loadIntlContext(args)).intl;
