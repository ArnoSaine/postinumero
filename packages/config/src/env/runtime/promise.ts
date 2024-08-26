import { merge } from "lodash-es";
import runtime from "../../runtime/promise.js";
import env from "../promise.js";

export default new Promise(async (resolve) =>
  resolve(merge({}, await env, await runtime)),
);
