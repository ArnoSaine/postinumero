import { pathExists } from "fs-extra/esm";
import { createRequire } from "node:module";
import { join } from "node:path";
import { dirname } from "path/posix";
import { readPackageUp } from "read-package-up";
import { LANG_DIR } from "./config.ts";
import { asyncFilter, asyncMap } from "./utils/array.ts";

export async function getDependencyPaths() {
  const visitedDependenciesSet = new Set<string>();

  const dependencies = await (async function recur(
    relativePath,
  ): Promise<string[]> {
    const packageUp = await readPackageUp({ cwd: relativePath });

    if (packageUp) {
      const { path, packageJson } = packageUp;
      if (!visitedDependenciesSet.has(path)) {
        const require = createRequire(`file://${path}`);
        visitedDependenciesSet.add(path);
        const dependencies = Object.keys(packageJson.dependencies ?? []);

        const dependencyPaths = await asyncMap(
          dependencies,
          async (dependency) => {
            try {
              return await recur(require.resolve(dependency));
            } catch {
              return [];
            }
          },
        );

        return [path, ...dependencyPaths.flat()];
      }
    }
    return [];
  })(process.cwd());

  return (
    dependencies
      .map(dirname)
      // Without self
      .slice(1)
  );
}

export const getLangDependencyPaths = () =>
  asyncFilter(getDependencyPaths(), hasLangDir);

const hasLangDir = (path: string) => pathExists(join(path, LANG_DIR));
