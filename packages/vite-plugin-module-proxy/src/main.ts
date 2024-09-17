import path from "node:path";
import { PartialResolvedId } from "rollup";
import invariant from "tiny-invariant";
import { Plugin, ResolvedConfig } from "vite";

type Target = string | Promise<string>;

interface Options {
  target: Target | readonly Target[];
  reExportAllFrom?: boolean | string | Promise<boolean | string>;
  handler: string | Promise<string>;
  base?: string;
}

const isRelative = (path: string) => path.at(0) === ".";

const defaultExportRegExp =
  /^\bexport\s+(default\b|{(|\s+\w+ as )\s*default\s*}\s*)/m;

export default function moduleProxy({
  target,
  handler: handlerPromise,
  reExportAllFrom: reExportAllFromPromise,
  base,
}: Options): Plugin {
  let resolvedConfig: ResolvedConfig;

  const asyncHandler = Promise.withResolvers<string>();
  const asyncNextHandler = Promise.withResolvers<string | null>();
  const asyncSkipImporters = Promise.withResolvers<string[]>();

  const id = Symbol();
  const targetsPromise = new Promise<string[]>(async (resolve) => {
    const targets = await target;
    resolve(Array.isArray(targets) ? await Promise.all(targets) : [targets]);
  });

  return {
    name: "@postinumero/vite-plugin-module-proxy",
    api: { id },

    // Catch raw imports before any other resolve plugins
    enforce: "pre",

    configResolved(config) {
      resolvedConfig = config;
    },

    async buildStart() {
      const { root } = resolvedConfig;

      const handler = await handlerPromise;
      const targets = await targetsPromise;

      const handlerResolved = await this.resolve(
        path.isAbsolute(handler)
          ? handler
          : isRelative(handler)
            ? path.join(base ?? root, handler)
            : handler,
      );

      invariant(handlerResolved, "Handler resolved");

      asyncHandler.resolve(handlerResolved.id);

      const subsequentPlugins = resolvedConfig.plugins.slice(
        resolvedConfig.plugins.findIndex(({ api }) => api?.id === id) + 1,
      );

      const targetsResolvedBySubsequentPlugins = (
        await Promise.all(
          targets.flatMap((target) =>
            subsequentPlugins.map(
              (plugin) =>
                typeof plugin.resolveId === "function" &&
                plugin.resolveId.call(this, target, undefined, {
                  attributes: {},
                  isEntry: false,
                }),
            ),
          ),
        )
      )
        .filter(Boolean)
        .map((resolved) =>
          typeof resolved === "string"
            ? resolved
            : (resolved as PartialResolvedId)?.id,
        )
        .filter(Boolean);

      asyncSkipImporters.resolve([
        handlerResolved.id,
        ...targetsResolvedBySubsequentPlugins,
      ]);

      let nextHandler: string | null =
        targetsResolvedBySubsequentPlugins[0] ?? targets[0]!;
      if (targets.includes(nextHandler)) {
        if (path.isAbsolute(nextHandler)) {
          nextHandler += "?__original";
        } else {
          nextHandler = null;
        }
      }
      asyncNextHandler.resolve(nextHandler);
    },

    async resolveId(source, importer) {
      const targets = await targetsPromise;

      if (!targets.includes(source)) {
        return null;
      }

      const handler = await asyncHandler.promise;

      if (importer === handler) {
        return asyncNextHandler.promise;
      }

      // Skip if the importer is from a subsequent plugin
      if (importer && (await asyncSkipImporters.promise).includes(importer)) {
        return null;
      }

      return handler;
    },

    async transform(code, id) {
      const targets = await targetsPromise;
      let reExportAllFrom = await reExportAllFromPromise;
      const handler = await asyncHandler.promise;

      const noDefaultExport =
        reExportAllFrom === true || defaultExportRegExp.test(code);

      if ([undefined, true].includes(reExportAllFrom as any)) {
        reExportAllFrom = targets[0];
      }

      if (id === handler && reExportAllFrom) {
        return `${
          noDefaultExport
            ? ""
            : `export { default } from "${reExportAllFrom}";
`
        }export * from "${reExportAllFrom}";
${code}`;
      }
    },
  };
}
