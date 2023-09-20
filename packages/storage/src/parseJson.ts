import type { JSONParseParameters } from "./index.js";

export default function parseJson(...args: JSONParseParameters) {
  const [value] = args;
  return value === null ? undefined : JSON.parse(...args);
}
