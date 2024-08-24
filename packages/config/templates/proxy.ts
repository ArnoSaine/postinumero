import reflect from "~/utils/reflect.js";
import ref from "./ref.js";

const [value, setValue] = reflect(Object);

export const ready = ref.ready;

(async () => {
  await ref.ready;
  setValue(ref.current);
})();

export default value;
