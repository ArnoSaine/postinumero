import { merge } from "lodash-es";
import file from "../../file/promise.js";
import global from "../../global/promise.js";

export default new Promise(async (resolve) =>
  resolve(merge({}, await global, await file)),
);
