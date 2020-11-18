import { extname } from 'path';
import lodash from 'lodash';

const extnameSafe = (path = '') => extname(path);

export default (env) => {
  const extensions = lodash.uniq(
    [
      ...Object.entries(env)
        .filter(([key]) =>
          ['npm_package_bin_', 'npm_package_exports_'].some((keyStart) =>
            key.startsWith(keyStart)
          )
        )
        .map(([key, value]) => value),
      env.npm_package_main,
      env.npm_package_bin,
      env.npm_package_exports,
    ]
      .filter(Boolean)
      .map(extname)
  );
  return (extensions.length ? extensions.sort() : ['.js']).map((extension) => [
    extension,
    extension === '.js'
      ? env.npm_package_type === 'module'
        ? 'mjs'
        : 'cjs'
      : extension.slice(1),
  ]);
};
