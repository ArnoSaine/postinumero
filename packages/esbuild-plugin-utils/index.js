import { escapeRegExp } from "lodash-es";
import { createRequire } from "module";
import fs from "node:fs/promises";
import { join, parse } from "node:path";
import { pathExists } from "path-exists";
import readdirp from "readdirp";

const require = createRequire(import.meta.url);

export const toModulePath = (...parts) => parts.join("/");

export const name = async (url, path = ".") =>
  JSON.parse(await fs.readFile(new URL(join(path, "package.json"), url))).name;

export const createPlugin = async (options) => ({
  name: await name(options.url),
  setup: setup(options),
});

const setup =
  ({ url, modulesPath = "modules", root, metaPrefix = "_.js" }) =>
  async (build) => {
    root ??= await name(url);
    const parsedMetaPrefix = parse(metaPrefix);
    for await (const { fullPath, path } of readdirp(
      new URL(modulesPath, url).pathname
    )) {
      const parsedPath = parse(path);
      // Is not meta?
      if (!parsedPath.name.endsWith(parsedMetaPrefix.name)) {
        const parsedFullPath = parse(fullPath);
        const metaFullPath = join(
          parsedFullPath.dir,
          parsedPath.name + metaPrefix
        );
        create({
          build,
          originalModule: toModulePath(parsedPath.dir, parsedPath.name),
          plugin: toModulePath(root, modulesPath, path),
          // Has meta?
          ...((await pathExists(metaFullPath))
            ? await import(metaFullPath)
            : undefined),
        });
      }
    }
  };

export function create({
  as,
  build,
  filterFn,
  plugin,
  originalModule,
  originalModuleFullPath = originalModule,
}) {
  const filter = new RegExp(`^${escapeRegExp(originalModule)}$`);
  const pluginResolvedPath = require.resolve(plugin);
  build.onResolve({ filter }, (onResolveArgs) => {
    if (
      (filterFn?.(onResolveArgs) ?? true) &&
      onResolveArgs.importer !== pluginResolvedPath
    ) {
      return { path: pluginResolvedPath };
    }
  });
  build.onLoad(
    { filter: new RegExp(`^${escapeRegExp(pluginResolvedPath)}$`) },
    async ({ path }) => ({
      contents: `${
        as
          ? `import * as ${as} from "${originalModuleFullPath}";
`
          : ""
      }export * from "${originalModuleFullPath}";
  ${await fs.readFile(path, "utf8")}`,
      loader: "default",
    })
  );
}
