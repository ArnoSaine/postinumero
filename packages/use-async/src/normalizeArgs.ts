import type { Config, Fn, MethodReturnType } from './index.js';

const defaultConfig = {};

export default function normalizeArgs<MethodType>(method: Fn) {
  function normalized<Func extends Fn>(
    func: Func
  ): MethodReturnType<MethodType, Func>;

  function normalized<Func extends Fn>(
    func: Func,
    funcArgs: Parameters<Func>
  ): MethodReturnType<MethodType, Func>;

  function normalized<Func extends Fn>(
    func: Func,
    config: Config,
    funcArgs: Parameters<Func>
  ): MethodReturnType<MethodType, Func>;

  function normalized<Func extends Fn>(
    func: Func,
    config = defaultConfig,
    funcArgs = [] as unknown as Parameters<Func>
  ): MethodReturnType<MethodType, Func> {
    if (Array.isArray(config)) {
      funcArgs = config as Parameters<Func>;
      config = defaultConfig;
    }
    return method(func, config, funcArgs);
  }

  return normalized;
}
