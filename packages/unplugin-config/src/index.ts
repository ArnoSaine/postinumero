import invariant from "tiny-invariant";
import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";
import * as formats from "./formats";
import type { ModifierOption } from "./plugin/modifierHandlers";
import { SourceOption } from "./plugin/sourceHandlers";
import type { Options } from "./types";

function setDefaults<T, U>(entries: [T, U][]) {
  return entries
    .filter(([, value]) => value !== false)
    .map(([name, value]) => (value ? [name, value] : name));
}

export const unpluginFactory: UnpluginFactory<Options | undefined> = (
  options: Options = {},
) => {
  options.importPath ??= "~config";
  const virtualModuleId = options.importPath;
  const virtualModuleIdPrefix = `${virtualModuleId}/`;
  const resolvedVirtualModuleId = `\0${virtualModuleId}`;
  const resolvedVirtualModuleIdPrefix = `\0${virtualModuleId}/`;

  function setDefaultOptions() {
    options.global ??= "process.env";
    options.file ??= "config.json";
    options.fetch ??= "config.json";
    options.modifiers ??= setDefaults([
      ["strip-prefix", options.stripPrefix],
      ["parse-json-values", options.parseJsonValue],
      ["unflat", options.unflat],
    ]) as ModifierOption[];
    options.sources ??= setDefaults([
      ["file", options.file],
      ["global", options.global],
      ["fetch", options.fetch],
    ]) as SourceOption[];
  }

  return {
    name: "@postinumero/unplugin-config",
    farm: {
      buildStart() {
        options.stripPrefix ??= "FARM_";

        setDefaultOptions();
      },
    },
    vite: {
      buildStart() {
        options.global ??= "import.meta.env";
        options.stripPrefix ??= "VITE_";

        setDefaultOptions();
      },
    },
    buildStart() {
      setDefaultOptions();
    },
    resolveId(id) {
      if (id === virtualModuleId || id.startsWith(virtualModuleIdPrefix)) {
        return `\0${id}`;
      }
    },
    loadInclude(id) {
      const [path] = id.split("?");
      return (
        path === resolvedVirtualModuleId ||
        path.startsWith(resolvedVirtualModuleIdPrefix)
      );
    },
    async load(id) {
      const [path, search] = id.split("?");
      const query = search ? `?${search}` : "";
      const formatName =
        path.slice(resolvedVirtualModuleIdPrefix.length) || "awaited";

      const format = formats[formatName as keyof typeof formats];

      invariant(format, `Unknown format: '${formatName}'`);

      return format(options, { query, search });
    },
  };
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
