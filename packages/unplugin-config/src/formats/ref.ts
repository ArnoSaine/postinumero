import { FormatOptions } from ".";
import { Options } from "../types";

export default function ref({ importPath }: Options, { query }: FormatOptions) {
  return `import createRef from "@postinumero/config/utils/createRef";
import promise from "${importPath}/promise${query}";

export default createRef(promise);`;
}
