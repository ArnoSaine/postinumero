import { pathExists } from "fs-extra/esm";
import { createRequire } from "node:module";
import { join } from "node:path";
import { dirname } from "path/posix";
import { readPackageUp } from "read-package-up";
import { LANG_DIR } from "./config.ts";
import { asyncFilter, asyncMap } from "./utils/array.ts";

export async function getDependencyPaths() {
  const dependenciesSet = new Set<string>();

  await (async function recur(relativePath) {
    const packageUp = await readPackageUp({ cwd: relativePath });

    if (packageUp) {
      const { path, packageJson } = packageUp;
      if (!dependenciesSet.has(path)) {
        const require = createRequire(`file://${path}`);
        dependenciesSet.add(path);
        const dependencies = Object.keys(packageJson.dependencies ?? []);

        await asyncMap(dependencies, async (dependency) => {
          try {
            await recur(require.resolve(dependency));
          } catch {}
        });
      }
    }
  })(process.cwd());

  return (
    [...dependenciesSet]
      .map(dirname)
      // Without self
      .slice(1)
  );
}

export const getLangDependencyPaths = () =>
  asyncFilter(getDependencyPaths(), hasLangDir);

const hasLangDir = (path: string) => pathExists(join(path, LANG_DIR));
