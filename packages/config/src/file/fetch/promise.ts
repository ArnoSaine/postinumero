import { merge } from "lodash-es";
import fetch from "../../fetch/promise.js";
import file from "../../file/promise.js";

export default new Promise(async (resolve) =>
  resolve(merge({}, await file, await fetch)),
);
