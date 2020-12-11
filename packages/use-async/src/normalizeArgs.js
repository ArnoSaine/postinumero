const defaultConfig = {};

export default function normalizeArgs(fn) {
  return (...args) => {
    let [func, config = defaultConfig, funcArgs = []] = args;
    if (Array.isArray(config)) {
      funcArgs = config;
      config = defaultConfig;
    }
    return fn(func, config, funcArgs);
  };
}
