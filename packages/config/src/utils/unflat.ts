import { unflatten, type UnflattenOptions } from "flat";

export default <T>(env: T, options: UnflattenOptions = {}) =>
  unflatten(env, {
    overwrite: true,
    ...options,
  });
