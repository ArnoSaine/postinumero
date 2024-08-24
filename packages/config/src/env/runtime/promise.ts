import { merge } from "lodash-es";
import env from "../../env.js";
import runtime from "../../runtime/promise.js";

export default new Promise(async (resolve) =>
  resolve(merge({}, env, await runtime)),
);
