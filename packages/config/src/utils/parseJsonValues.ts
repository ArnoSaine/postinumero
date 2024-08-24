import { mapValues } from "lodash-es";

function tryJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export default <T extends Object>(obj: T) => mapValues<T>(obj, tryJsonParse);
