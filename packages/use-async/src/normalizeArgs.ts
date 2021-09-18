import type { Config, Fn } from '.';

const defaultConfig = {};

export default function normalizeArgs<Method extends Fn>(method: Method) {
  function normalized<Func extends Fn>(func: Func): ReturnType<Method>;

  function normalized<Func extends Fn>(
    func: Func,
    funcArgs: Parameters<Func>
  ): ReturnType<Method>;

  function normalized<Func extends Fn>(
    func: Func,
    config: Config,
    funcArgs: Parameters<Func>
  ): ReturnType<Method>;

  function normalized<Func extends Fn>(
    func: Func,
    config = defaultConfig,
    funcArgs = [] as unknown as Parameters<Func>
  ): ReturnType<Method> {
    if (Array.isArray(config)) {
      funcArgs = config as Parameters<Func>;
      config = defaultConfig;
    }
    return method(func, config, funcArgs);
  }

  return normalized;
}
