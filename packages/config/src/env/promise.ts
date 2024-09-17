import { mapKeys } from "lodash-es";
import { removePrefix } from "../env.js";
import parseJsonValues from "../utils/parseJsonValues.js";
import unflat from "../utils/unflat.js";

const { promise: envPromise, resolve: init } =
  Promise.withResolvers<ImportMetaEnv>();

export { init };

export default new Promise<ImportMetaEnv>(async (resolve) =>
  resolve(
    unflat(
      parseJsonValues(
        mapKeys(await envPromise, (_value, key) => {
          const prefix = removePrefix.find((prefix) => key.startsWith(prefix));

          return prefix ? key.slice(prefix.length) : key;
        }),
      ),
    ) as ImportMetaEnv,
  ),
);
