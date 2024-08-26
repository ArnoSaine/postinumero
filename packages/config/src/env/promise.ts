import { mapKeys } from "lodash-es";
import parseJsonValues from "../utils/parseJsonValues.js";
import unflat from "../utils/unflat.js";

let init: (env: ImportMetaEnv) => void;

const envPromise = new Promise<ImportMetaEnv>((resolve) => (init = resolve));

export { init };

const vitePrefix = "VITE_";

export default new Promise<ImportMetaEnv>(async (resolve) =>
  resolve(
    unflat(
      parseJsonValues(
        mapKeys(await envPromise, (_value, key) =>
          key.startsWith(vitePrefix) ? key.slice(vitePrefix.length) : key,
        ),
      ),
    ) as ImportMetaEnv,
  ),
);
