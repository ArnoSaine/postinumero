import { FormatOptions } from ".";
import { Options } from "../types";

export default function proxy(
  { importPath }: Options,
  { query }: FormatOptions,
) {
  return `import reflect from "@postinumero/config/utils/reflect";
import ref from "${importPath}/ref${query}";

const [value, setValue] = reflect(Object);

export const ready = ref.ready;

(async () => {
  await ref.ready;
  setValue(ref.current);
})();

export default value;`;
}
