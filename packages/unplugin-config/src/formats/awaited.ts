import { FormatOptions } from ".";
import { Options } from "../types";

export default function awaited(
  { importPath }: Options,
  { query }: FormatOptions,
) {
  return `import promise from "${importPath}/promise${query}";

export default await promise;`;
}
