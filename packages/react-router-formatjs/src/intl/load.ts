import { options, type DataFunctionArgs } from "../options.ts";
import { getIntlConfig } from "./config.ts";
import { createIntl } from "./index.ts";

export const loadIntl = async (args: DataFunctionArgs) =>
  createIntl(await getIntlConfig(await options.loadOptions(args)));
