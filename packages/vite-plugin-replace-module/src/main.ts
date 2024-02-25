import type { Plugin } from "vite";

interface Rule {
  source: string;
  pathname: string;
}

export default function replaceModule(rules: Rule[]): Plugin {
  return {
    name: "@postinumero/replace-module",
    enforce: "pre",
    resolveId(source, importer) {
      return rules.find(
        (rule) => source === rule.source && importer !== rule.pathname
      )?.pathname;
    },
  };
}
