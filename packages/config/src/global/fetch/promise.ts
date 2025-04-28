import { merge } from "lodash-es";
import fetch from "../../fetch/promise.js";
import global from "../../global/promise.js";

export default new Promise(async (resolve) =>
  resolve(merge({}, await global, await fetch)),
);
