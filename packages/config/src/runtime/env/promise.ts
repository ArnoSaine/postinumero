import { merge } from "lodash-es";
import env from "../../env/promise.js";
import runtime from "../promise.js";

export default new Promise(async (resolve) =>
  resolve(merge({}, await runtime, await env)),
);
