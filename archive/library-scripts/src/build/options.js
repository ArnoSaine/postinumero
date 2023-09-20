import { extname } from 'path';
import lodash from 'lodash';

export default (packageJson) => {
  const entries = (entry) =>
    ({
      object: () => Object.values(entry).flatMap(entries),
      string: () => entry,
    }[typeof entry]?.());

  const extensions = lodash.uniq(
    [packageJson.main, packageJson.bin, packageJson.exports]
      .flatMap(entries)
      .filter(Boolean)
      .map(extname)
      .filter(Boolean)
  );

  return (extensions.length ? extensions.sort() : ['.js']).map((extension) => [
    extension,
    extension === '.js'
      ? packageJson.type === 'module'
        ? 'mjs'
        : 'cjs'
      : extension.slice(1),
  ]);
};
