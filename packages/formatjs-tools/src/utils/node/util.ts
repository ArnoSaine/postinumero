import { unflatten } from "flat";
import { camelCase } from "lodash-es";
import { deepMapKeys } from "../object.ts";

export const argsValuesToOptions = (values: Record<string, unknown>) =>
  deepMapKeys(unflatten(values), camelCase);
